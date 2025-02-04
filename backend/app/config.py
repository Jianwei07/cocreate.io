import os
from dotenv import load_dotenv

load_dotenv()

# Define model settings
VLLM_HOST = os.getenv("VLLM_HOST", "http://localhost:8001")
VLLM_MODEL = os.getenv("VLLM_MODEL", "deepseek-ai/deepseek-coder-1.3b")
MAX_TOKENS = int(os.getenv("MAX_TOKENS", 300))
TEMPERATURE = float(os.getenv("TEMPERATURE", 0.7))
