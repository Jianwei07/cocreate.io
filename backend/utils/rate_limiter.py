from fastapi import Request, HTTPException
from functools import wraps
import time

user_requests = {}

def rate_limiter(max_calls: int, time_window: int):
    """
    Rate limiting decorator to prevent excessive API calls.
    - max_calls: Number of allowed requests in the time window.
    - time_window: Time window in seconds.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(request: Request, *args, **kwargs):
            user_ip = request.client.host
            current_time = time.time()

            if user_ip not in user_requests:
                user_requests[user_ip] = []

            user_requests[user_ip] = [t for t in user_requests[user_ip] if current_time - t < time_window]

            if len(user_requests[user_ip]) >= max_calls:
                raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")

            user_requests[user_ip].append(current_time)
            return await func(request, *args, **kwargs)
        
        return wrapper
    return decorator
