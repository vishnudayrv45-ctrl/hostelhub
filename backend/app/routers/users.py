from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db
from schemas import UserCreate, UserResponse
from auth import hash_password
from dependencies import get_current_user, require_role


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


# -------------------------
# GET ALL USERS
# -------------------------

@router.get("/", response_model=list[UserResponse])
def get_users(
    db: Session = Depends(get_db)
):
    return db.query(models.User).all()


# -------------------------
# CREATE USER
# -------------------------

@router.post("/", response_model=UserResponse)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    existing_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
        role=user.role,
        phone=user.phone
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# -------------------------
# CURRENT USER
# IMPORTANT: /me MUST COME
# BEFORE /{user_id}
# -------------------------

@router.get("/me")
def get_my_profile(
    current_user=Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "phone": current_user.phone,
        "is_active": current_user.is_active
    }


# -------------------------
# ADMIN ONLY
# -------------------------

@router.get("/admin-only")
def admin_only(
    current_user=Depends(
        require_role("admin")
    )
):
    return {
        "message": "Welcome Admin",
        "user": current_user.name,
        "role": current_user.role
    }


# -------------------------
# WARDEN ONLY
# -------------------------

@router.get("/warden-only")
def warden_only(
    current_user=Depends(
        require_role("warden")
    )
):
    return {
        "message": "Welcome Warden",
        "user": current_user.name,
        "role": current_user.role
    }


# -------------------------
# STUDENT ONLY
# -------------------------

@router.get("/student-only")
def student_only(
    current_user=Depends(
        require_role("student")
    )
):
    return {
        "message": "Welcome Student",
        "user": current_user.name,
        "role": current_user.role
    }


# -------------------------
# GET USER BY ID
# IMPORTANT: Keep this AFTER
# /me and the role routes
# -------------------------

@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(
        models.User.id == user_id
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user