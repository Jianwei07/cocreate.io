from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_limiter import FastAPILimiter
import redis.asyncio as redis
import uvicorn

from app.routes import optimize, health  # Ensure optimize.py and health.py exist!

# Initialize FastAPI App
app = FastAPI(title="AI Optimizer with Hugging Face Inference (vLLM Alternative)")

# ✅ CORS (Enable if frontend calls this API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain if hosting securely
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    """Initialize Redis for rate limiting at FastAPI startup"""
    redis_client = redis.Redis(host="localhost", port=6379, decode_responses=True)
    await FastAPILimiter.init(redis_client)

@app.on_event("shutdown")
async def shutdown():
    """Shutdown Redis connection properly"""
    await FastAPILimiter.close()

# ✅ Include API Routes
app.include_router(optimize.router, prefix="/ai")
app.include_router(health.router, prefix="/health")

@app.get("/")
def home():
    return {"message": "Welcome to the AI Optimizer API!"}

# ✅ Run API if executed directly
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
