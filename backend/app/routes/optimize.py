from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import requests
from dotenv import load_dotenv
import os

load_dotenv()
router = APIRouter()

HF_API_URL = os.getenv("HF_API_URL")
HF_API_KEY = os.getenv("HF_API_KEY")

class OptimizeRequest(BaseModel):
    text: str
    prompt: str

@router.post("/optimize")
async def optimize_text(request: OptimizeRequest):
    """AI Optimization API"""
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {"inputs": f"{request.prompt}: {request.text}"}

    try:
        response = requests.post(HF_API_URL, headers=headers, json=payload)
        response_data = response.json()

        # 🛑 Debugging: Print Response from Hugging Face
        print("🔍 HF API Response:", response_data)

        if response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"AI Optimization failed: {response_data}")

        return {"formatted_text": response_data[0].get("generated_text", "No response")}
    
    except Exception as e:
        print("❌ Error:", str(e))
        raise HTTPException(status_code=500, detail="AI Optimization failed")
