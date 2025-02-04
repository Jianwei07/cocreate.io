import requests
import json
from app.config import VLLM_HOST, MAX_TOKENS, TEMPERATURE

# Define prompt templates for different actions.
PROMPT_TEMPLATES = {
    "Polish Writing": "Enhance clarity and flow of the following text while preserving its meaning:\n\n{}",
    "Fix Grammar": "Correct any grammar and spelling errors in the following text while preserving its meaning:\n\n{}",
    "Simplify": "Simplify the following text to make it easier to understand:\n\n{}",
    "Condense": "Summarize the following text more concisely:\n\n{}",
    "Expand": "Expand the following text with more detail and explanation:\n\n{}",
    "Professional Tone": "Rewrite the following text in a professional tone:\n\n{}",
    "Casual Tone": "Rewrite the following text in a casual and friendly tone:\n\n{}",
    "Persuasive Tone": "Rewrite the following text in a persuasive and compelling way:\n\n{}",
}

def optimize_text(text: str, action: str) -> str:
    if action not in PROMPT_TEMPLATES:
        return "Invalid optimization action selected."

    formatted_prompt = PROMPT_TEMPLATES[action].format(text)
    payload = {
        "prompt": formatted_prompt,
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS,
    }
    try:
        response = requests.post(f"{VLLM_HOST}/generate", json=payload)
        response_data = response.json()
        if response.status_code == 200:
            return response_data["text"]
        else:
            return f"Error {response.status_code}: {response_data.get('error', 'Unknown error')}"
    except requests.exceptions.RequestException as e:
        return f"Request failed: {str(e)}"
