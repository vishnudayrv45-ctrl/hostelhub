from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Enum,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from database import Base


# -------------------------
# USER
# -------------------------

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(100), nullable=False)

    email = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True
    )

    password_hash = Column(String(255), nullable=False)

    role = Column(
        Enum("student", "warden", "admin", name="user_role"),
        nullable=False,
        default="student"
    )

    phone = Column(String(20), nullable=True)

    is_active = Column(Boolean, default=True)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    allocations = relationship(
        "Allocation",
        back_populates="student"
    )

    transfer_requests = relationship(
        "TransferRequest",
        back_populates="student"
    )

    complaints = relationship(
        "Complaint",
        back_populates="student"
    )


# -------------------------
# HOSTEL
# -------------------------

class Hostel(Base):
    __tablename__ = "hostels"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        nullable=False
    )

    location = Column(
        String(200),
        nullable=True
    )

    description = Column(
        Text,
        nullable=True
    )

    total_rooms = Column(
        Integer,
        default=0
    )

    rooms = relationship(
        "Room",
        back_populates="hostel",
        cascade="all, delete-orphan"
    )


# -------------------------
# ROOM
# -------------------------

class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    room_number = Column(
        String(20),
        nullable=False
    )

    floor = Column(
        Integer,
        nullable=True
    )

    capacity = Column(
        Integer,
        nullable=False
    )

    occupied = Column(
        Integer,
        default=0
    )

    status = Column(
        Enum(
            "available",
            "full",
            "maintenance",
            name="room_status"
        ),
        default="available",
        nullable=False
    )

    hostel_id = Column(
        Integer,
        ForeignKey("hostels.id"),
        nullable=False
    )

    hostel = relationship(
        "Hostel",
        back_populates="rooms"
    )

    allocations = relationship(
        "Allocation",
        back_populates="room"
    )


# -------------------------
# ROOM ALLOCATION
# -------------------------

class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    room_id = Column(
        Integer,
        ForeignKey("rooms.id"),
        nullable=False
    )

    allocated_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    is_active = Column(
        Boolean,
        default=True
    )

    student = relationship(
        "User",
        back_populates="allocations"
    )

    room = relationship(
        "Room",
        back_populates="allocations"
    )


# -------------------------
# ROOM TRANSFER REQUEST
# -------------------------

class TransferRequest(Base):
    __tablename__ = "transfer_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    current_room_id = Column(
        Integer,
        ForeignKey("rooms.id"),
        nullable=True
    )

    requested_room_id = Column(
        Integer,
        ForeignKey("rooms.id"),
        nullable=True
    )

    reason = Column(
        Text,
        nullable=False
    )

    status = Column(
        Enum(
            "pending",
            "approved",
            "rejected",
            name="transfer_status"
        ),
        default="pending",
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    student = relationship(
        "User",
        back_populates="transfer_requests"
    )


# -------------------------
# MAINTENANCE COMPLAINT
# -------------------------

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    room_id = Column(
        Integer,
        ForeignKey("rooms.id"),
        nullable=True
    )

    title = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    status = Column(
        Enum(
            "pending",
            "in_progress",
            "resolved",
            "rejected",
            name="complaint_status"
        ),
        default="pending",
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    resolved_at = Column(
        DateTime,
        nullable=True
    )

    student = relationship(
        "User",
        back_populates="complaints"
    )