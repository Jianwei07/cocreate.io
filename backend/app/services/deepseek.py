# backend/app/services/deepseek.py
from huggingface_hub import InferenceClient

class DeepSeekService:
    def __init__(self):
        self.client = InferenceClient(token="your_hugging_face_token")

    def optimize_content(self, text: str, platform: str) -> str:
        prompt = f"""Optimize this content for {platform}:
        - Follow platform guidelines
        - Use appropriate hashtags
        - Keep it engaging
        
        Content: {text}"""
        
        response = self.client.text_generation(
            prompt,
            model="deepseek-ai/deepseek-chat",
            max_new_tokens=200,
            temperature=0.7
        )
        
        return response