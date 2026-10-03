from pydantic import BaseModel
from typing import Optional


# -------------------------
# USER
# -------------------------

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str = "student"
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    phone: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True


# -------------------------
# HOSTEL
# -------------------------

class HostelCreate(BaseModel):
    name: str
    location: Optional[str] = None
    description: Optional[str] = None
    total_rooms: int = 0


class HostelResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]
    description: Optional[str]
    total_rooms: int

    class Config:
        from_attributes = True


# -------------------------
# ROOM
# -------------------------

class RoomCreate(BaseModel):
    room_number: str
    floor: Optional[int] = None
    capacity: int
    hostel_id: int


class RoomResponse(BaseModel):
    id: int
    room_number: str
    floor: Optional[int]
    capacity: int
    occupied: int
    status: str
    hostel_id: int

    class Config:
        from_attributes = True


# -------------------------
# ALLOCATION
# -------------------------

class AllocationCreate(BaseModel):
    student_id: int
    room_id: int


# -------------------------
# TRANSFER REQUEST
# -------------------------

class TransferRequestCreate(BaseModel):
    student_id: int
    current_room_id: Optional[int] = None
    requested_room_id: Optional[int] = None
    reason: str


# -------------------------
# COMPLAINT
# -------------------------

class ComplaintCreate(BaseModel):
    student_id: int
    room_id: Optional[int] = None
    title: str
    description: str


# -------------------------
# AUTHENTICATION
# -------------------------

class LoginRequest(BaseModel):
    email: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str