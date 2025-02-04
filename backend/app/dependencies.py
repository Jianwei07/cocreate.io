from fastapi import HTTPException, Header, Depends

# Dummy auth dependency; replace with your actual Supabase auth logic.
def get_current_user(authorization: str = Header(...)):
    # In a real app, decode the JWT from Supabase and validate it.
    # Here, we assume that if an Authorization header is provided, the user is authenticated.
    if not authorization:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return {"user": "testuser"}  # Dummy user data
