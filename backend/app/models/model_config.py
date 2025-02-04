# This file centralizes model parameters.
import os
from dotenv import load_dotenv

load_dotenv()

HF_API_URL = os.getenv("HF_API_URL", "https://api-inference.huggingface.co/models/deepseek-ai/DeepSeek-R1")
HF_API_KEY = os.getenv("HF_API_KEY")
MAX_TOKENS = 300  # Limit output size
TEMPERATURE = 0.7  # Control creativity
TOP_P = 0.9  # Nucleus sampling

