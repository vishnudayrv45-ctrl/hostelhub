from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
from database import get_db
from auth import verify_password, create_access_token


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# -------------------------
# LOGIN SCHEMA
# -------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


# -------------------------
# AUTH STATUS
# -------------------------

@router.get("/status")
def auth_status():

    return {
        "message": "Authentication module is working",
        "status": "active"
    }


# -------------------------
# LOGIN
# -------------------------

@router.post("/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(
        models.User.email == login_data.email
    ).first()

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not verify_password(
        login_data.password,
        user.password_hash
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    if not user.is_active:

        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    access_token = create_access_token(
        user_id=user.id,
        email=user.email,
        role=user.role
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }