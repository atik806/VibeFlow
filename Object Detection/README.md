# Real-Time Object Detection Web App (YOLOv8 + FastAPI)

A real-time object detection web application that streams webcam frames to a browser and runs YOLOv8 inference continuously with low-latency settings.

## Features

- Live webcam stream in browser
- Real-time YOLOv8 object detection
- Bounding boxes, labels, and confidence scores
- Start/Stop detection control
- Live stats (FPS, inference time, object count)
- Per-class object counting list

## Tech Stack

- **Backend:** FastAPI (Python)
- **Detection:** Ultralytics YOLOv8
- **Video:** OpenCV
- **Frontend:** HTML, CSS, JavaScript
- **Streaming:** MJPEG via HTTP endpoint

## Project Structure

```text
.
├── main.py
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    ├── styles.css
    └── app.js
```

## Setup

1. Create and activate a virtual environment (recommended):

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
```

2. Install dependencies:

```powershell
pip install -r requirements.txt
```

3. Run the server:

```powershell
uvicorn main:app --reload
```

4. Open your browser:

- [http://127.0.0.1:8000](http://127.0.0.1:8000)

## Notes on Performance

- The app uses `yolov8n.pt` by default for speed.
- Frame resolution is reduced to lower latency.
- JPEG quality is tuned for faster streaming.
- If CUDA is available, inference automatically attempts GPU (`device=0`).

## Optional Extensions

- Upload and process video files
- Train and load a custom YOLO model
- Deploy on a cloud VM with GPU acceleration
- Replace MJPEG with WebSocket streaming for more control
