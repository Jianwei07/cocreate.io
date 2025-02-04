from fastapi import FastAPI
from app.routes import optimize, health
import uvicorn
import subprocess

app = FastAPI(title="AI Optimizer with vLLM")

app.include_router(optimize.router)
app.include_router(health.router)

@app.on_event("startup")
async def startup_event():
    # Start the vLLM server if it's not already running.
    subprocess.Popen(["python", "vllm_server.py"])

@app.get("/")
def home():
    return {"message": "Welcome to AI Optimizer with vLLM!"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
