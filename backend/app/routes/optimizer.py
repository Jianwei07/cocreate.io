from fastapi import APIRouter, HTTPException, Depends
from app.services.ai_optimizer import optimize_text

router = APIRouter()

# Dummy authentication dependency
def get_current_user():
    # Replace this with real authentication logic
    # For now, we assume the user is always logged in.
    return {"username": "testuser"}

@router.post("/ai/optimize")
async def optimize_endpoint(payload: dict, current_user: dict = Depends(get_current_user)):
    text = payload.get("text")
    action = payload.get("prompt")
    if not text or not action:
        raise HTTPException(status_code=400, detail="Text or action missing")
    
    # TODO: Add rate limiting here (e.g., using Redis or in-memory counters)
    
    optimized_text = optimize_text(text, action)
    return {"formatted_text": optimized_text}
