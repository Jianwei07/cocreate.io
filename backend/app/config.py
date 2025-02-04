import os
from dotenv import load_dotenv

load_dotenv()

HF_API_URL = os.getenv("HF_API_URL", "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2")
HF_API_KEY = os.getenv("HF_API_KEY", "")
RATE_LIMIT = os.getenv("RATE_LIMIT", "5/minute")  # e.g., 5 requests per minute
