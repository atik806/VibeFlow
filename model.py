import os
import base64
from io import BytesIO
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient

load_dotenv(dotenv_path=r"e:\VibeFlow\VibeFlow\.env")

HF_TOKEN = os.getenv("HF_TOKEN", "").strip()

if not HF_TOKEN:
    raise ValueError("HF_TOKEN missing. Add to .env file.")

client = InferenceClient(
    model="stabilityai/stable-diffusion-xl-base-1.0",
    token=HF_TOKEN
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok"}

from pydantic import BaseModel

class PromptRequest(BaseModel):
    prompt: str

@app.post("/generate")
def generate_image(request: PromptRequest):
    try:
        image = client.text_to_image(request.prompt)
        buffered = BytesIO()
        image.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode()
        return {"image": img_str}
    except Exception as e:
        return {"error": str(e)}