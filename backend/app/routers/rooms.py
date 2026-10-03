from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)


# -------------------------
# GET ALL ROOMS
# -------------------------

@router.get("/")
def get_rooms(db: Session = Depends(get_db)):
    return db.query(models.Room).all()


# -------------------------
# GET ROOM BY ID
# -------------------------

@router.get("/{room_id}")
def get_room(
    room_id: int,
    db: Session = Depends(get_db)
):
    room = db.query(models.Room).filter(
        models.Room.id == room_id
    ).first()

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    return room


# -------------------------
# CREATE ROOM
# -------------------------

@router.post("/")
def create_room(
    room_number: str,
    capacity: int,
    hostel_id: int,
    floor: int = None,
    db: Session = Depends(get_db)
):
    # Check hostel exists
    hostel = db.query(models.Hostel).filter(
        models.Hostel.id == hostel_id
    ).first()

    if not hostel:
        raise HTTPException(
            status_code=404,
            detail="Hostel not found"
        )

    # Prevent duplicate room number in same hostel
    existing_room = db.query(models.Room).filter(
        models.Room.room_number == room_number,
        models.Room.hostel_id == hostel_id
    ).first()

    if existing_room:
        raise HTTPException(
            status_code=400,
            detail="Room already exists in this hostel"
        )

    # Capacity validation
    if capacity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Room capacity must be greater than 0"
        )

    new_room = models.Room(
        room_number=room_number,
        floor=floor,
        capacity=capacity,
        occupied=0,
        status="available",
        hostel_id=hostel_id
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room