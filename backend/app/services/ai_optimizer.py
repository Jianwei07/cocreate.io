import requests
import json
from app.config import HF_API_URL, HF_API_KEY

HEADERS = {
    "Authorization": f"Bearer {HF_API_KEY}",
    "Content-Type": "application/json",
}

# Define prompt templates for each action
PROMPT_TEMPLATES = {
    "Polish Writing": "Enhance clarity and flow of the following text while preserving its meaning:\n\n{}",
    "Fix Grammar": "Fix any grammar and spelling mistakes in the following text while preserving its meaning:\n\n{}",
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

    # Build the structured prompt:
    formatted_prompt = PROMPT_TEMPLATES[action].format(text)

    payload = {"inputs": formatted_prompt}
    try:
        response = requests.post(HF_API_URL, headers=HEADERS, data=json.dumps(payload))
        # Check for a successful response
        if response.status_code == 200:
            result = response.json()
            # Assuming the API returns a list with one result
            return result[0]["generated_text"]
        else:
            return f"Error {response.status_code}: {response.text}"
    except requests.exceptions.RequestException as e:
        return f"Request failed: {str(e)}"
