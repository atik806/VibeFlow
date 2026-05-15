import threading
import time
from collections import Counter
from typing import Dict, List

import cv2
import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, JSONResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO


app = FastAPI(title="Real-Time Object Detection")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory="static"), name="static")


class DetectionEngine:
    PROFILES = {
        "max_accuracy": {
            "model_name": "yolov8l.pt",
            "conf": 0.15,
            "iou": 0.45,
            "imgsz": 1280,
            "augment": True,
            "process_every_n": 1,
        },
        "balanced": {
            "model_name": "yolov8s.pt",
            "conf": 0.25,
            "iou": 0.45,
            "imgsz": 736,
            "augment": False,
            "process_every_n": 2,
        },
        "fast": {
            "model_name": "yolov8n.pt",
            "conf": 0.30,
            "iou": 0.50,
            "imgsz": 512,
            "augment": False,
            "process_every_n": 3,
        },
    }

    def __init__(self, model_name: str = "yolov8n.pt", camera_index: int = 0) -> None:
        self.model_name = model_name
        self.camera_index = camera_index
        self.model = YOLO(model_name)
        self.cap = None
        self.enabled = False
        self.lock = threading.Lock()
        self.last_counts: Dict[str, int] = {}
        self.last_fps = 0.0
        self.last_inference_ms = 0.0
        self.device = 0 if cv2.cuda.getCudaEnabledDeviceCount() > 0 else "cpu"
        self.profile_name = "fast"
        self.conf_threshold = 0.30
        self.iou_threshold = 0.50
        self.image_size = 512
        self.use_augment = False
        self.process_every_n = 3
        self.frame_index = 0
        self.last_annotated_frame = None

    def _ensure_camera(self) -> None:
        if self.cap is None or not self.cap.isOpened():
            self.cap = cv2.VideoCapture(self.camera_index)
            # Lower capture resolution and buffer depth improve FPS on CPU.
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 960)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 540)
            self.cap.set(cv2.CAP_PROP_FPS, 30)
            self.cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)

    def start(self) -> None:
        with self.lock:
            self._ensure_camera()
            if self.cap is None or not self.cap.isOpened():
                raise HTTPException(status_code=500, detail="Could not open webcam.")
            self.enabled = True

    def stop(self) -> None:
        with self.lock:
            self.enabled = False

    def set_profile(self, profile_name: str) -> None:
        profile_key = profile_name.strip().lower()
        if profile_key not in self.PROFILES:
            raise HTTPException(status_code=400, detail="Invalid profile name.")

        profile = self.PROFILES[profile_key]
        with self.lock:
            target_model = profile["model_name"]
            if target_model != self.model_name:
                self.model = YOLO(target_model)
                self.model_name = target_model

            self.profile_name = profile_key
            self.conf_threshold = profile["conf"]
            self.iou_threshold = profile["iou"]
            self.image_size = profile["imgsz"]
            self.use_augment = profile["augment"]
            self.process_every_n = profile["process_every_n"]

    def get_profile(self) -> str:
        with self.lock:
            return self.profile_name

    def release(self) -> None:
        with self.lock:
            self.enabled = False
            if self.cap is not None:
                self.cap.release()
                self.cap = None

    def _draw_detections(self, frame, detections) -> Dict[str, int]:
        counts: Counter = Counter()

        for result in detections:
            if result.boxes is None:
                continue

            boxes = result.boxes
            names = result.names
            for i in range(len(boxes)):
                cls_id = int(boxes.cls[i].item())
                conf = float(boxes.conf[i].item())
                x1, y1, x2, y2 = map(int, boxes.xyxy[i].tolist())
                label = names.get(cls_id, str(cls_id))
                counts[label] += 1

                color = (0, 200, 0)
                cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                caption = f"{label} {conf:.2f}"
                cv2.putText(
                    frame,
                    caption,
                    (x1, max(20, y1 - 8)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.55,
                    color,
                    2,
                    cv2.LINE_AA,
                )

        return dict(counts)

    def _overlay_status(self, frame) -> None:
        cv2.putText(
            frame,
            f"FPS: {self.last_fps:.1f}",
            (12, 24),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.7,
            (30, 220, 255),
            2,
            cv2.LINE_AA,
        )
        cv2.putText(
            frame,
            f"Inference: {self.last_inference_ms:.1f} ms",
            (12, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.6,
            (30, 220, 255),
            2,
            cv2.LINE_AA,
        )

    def frame_stream(self):
        last_frame_time = time.time()

        while True:
            with self.lock:
                active = self.enabled

            if not active:
                placeholder = self._make_placeholder("Detection paused. Click Start.")
                yield self._jpeg_chunk(placeholder)
                time.sleep(0.1)
                continue

            self._ensure_camera()
            if self.cap is None or not self.cap.isOpened():
                placeholder = self._make_placeholder("Webcam unavailable.")
                yield self._jpeg_chunk(placeholder)
                time.sleep(0.2)
                continue

            ok, frame = self.cap.read()
            if not ok:
                placeholder = self._make_placeholder("Unable to read frame.")
                yield self._jpeg_chunk(placeholder)
                time.sleep(0.05)
                continue

            self.frame_index += 1
            run_inference = (self.frame_index % self.process_every_n) == 0
            annotated = frame
            if run_inference or self.last_annotated_frame is None:
                inference_start = time.time()
                # classes=None means detect every class in the pretrained model.
                results = self.model.predict(
                    source=frame,
                    verbose=False,
                    conf=self.conf_threshold,
                    iou=self.iou_threshold,
                    imgsz=self.image_size,
                    device=self.device,
                    augment=self.use_augment,
                    half=(self.device == 0),
                )
                self.last_inference_ms = (time.time() - inference_start) * 1000
                self.last_counts = self._draw_detections(annotated, results)
                self.last_annotated_frame = annotated.copy()
            else:
                annotated = self.last_annotated_frame.copy()

            now = time.time()
            dt = max(now - last_frame_time, 1e-6)
            self.last_fps = 1.0 / dt
            last_frame_time = now
            self._overlay_status(annotated)

            yield self._jpeg_chunk(annotated)

    @staticmethod
    def _make_placeholder(message: str):
        frame = np.zeros((540, 960, 3), dtype=np.uint8)
        cv2.putText(
            frame,
            message,
            (30, 280),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.9,
            (255, 255, 255),
            2,
            cv2.LINE_AA,
        )
        return frame

    @staticmethod
    def _jpeg_chunk(frame) -> bytes:
        ok, buffer = cv2.imencode(".jpg", frame, [cv2.IMWRITE_JPEG_QUALITY, 80])
        if not ok:
            raise RuntimeError("Failed to encode JPEG frame.")
        return (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n" + buffer.tobytes() + b"\r\n"
        )


engine = DetectionEngine()


@app.get("/", response_class=HTMLResponse)
def home():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        return HTMLResponse(content=f.read())


@app.get("/video_feed")
def video_feed():
    return StreamingResponse(
        engine.frame_stream(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )


@app.post("/start")
def start_detection():
    engine.start()
    return JSONResponse({"running": True})


@app.post("/stop")
def stop_detection():
    engine.stop()
    return JSONResponse({"running": False})


@app.get("/stats")
def get_stats():
    total = sum(engine.last_counts.values())
    top: List[Dict[str, int]] = [
        {"label": k, "count": v}
        for k, v in sorted(engine.last_counts.items(), key=lambda item: item[1], reverse=True)
    ]
    return JSONResponse(
        {
            "running": engine.enabled,
            "profile": engine.get_profile(),
            "fps": round(engine.last_fps, 2),
            "inference_ms": round(engine.last_inference_ms, 2),
            "total_objects": total,
            "objects": top,
        }
    )


@app.post("/profile")
def set_profile(profile: str):
    engine.set_profile(profile)
    return JSONResponse(
        {
            "profile": engine.get_profile(),
            "model": engine.model_name,
            "imgsz": engine.image_size,
        }
    )


@app.on_event("shutdown")
def on_shutdown():
    engine.release()
