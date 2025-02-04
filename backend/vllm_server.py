import subprocess
from app.config import VLLM_MODEL

def start_vllm_server(model: str = VLLM_MODEL):
    command = [
        "python", "-m", "vllm.entrypoints.api_server",
        "--model", model,
        "--port", "8001"
    ]
    subprocess.Popen(command)

if __name__ == "__main__":
    start_vllm_server()
