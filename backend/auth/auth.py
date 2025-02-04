from fastapi import Depends, HTTPException
from supabase import create_client
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_ANON_KEY")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_current_user(token: str = Depends()):
    """
    Validates Supabase Auth token to ensure the user is logged in.
    """
    response = supabase.auth.get_user(token)
    
    if not response or response.get("error"):
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

    return response["data"]["user"]
