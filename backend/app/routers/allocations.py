from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(
    prefix="/allocations",
    tags=["Allocations"]
)


# GET ALL ALLOCATIONS
@router.get("/")
def get_allocations(db: Session = Depends(get_db)):
    return db.query(models.Allocation).all()


# GET ONE ALLOCATION
@router.get("/{allocation_id}")
def get_allocation(
    allocation_id: int,
    db: Session = Depends(get_db)
):
    allocation = db.query(models.Allocation).filter(
        models.Allocation.id == allocation_id
    ).first()

    if not allocation:
        raise HTTPException(
            status_code=404,
            detail="Allocation not found"
        )

    return allocation


# CREATE ALLOCATION
@router.post("/")
def create_allocation(
    student_id: int,
    room_id: int,
    db: Session = Depends(get_db)
):

    # Check student
    student = db.query(models.User).filter(
        models.User.id == student_id
    ).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail="Student not found"
        )

    # Only students can be allocated rooms
    if student.role != "student":
        raise HTTPException(
            status_code=400,
            detail="Only students can be allocated rooms"
        )

    # Check room
    room = db.query(models.Room).filter(
        models.Room.id == room_id
    ).first()

    if not room:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    # Check room maintenance
    if room.status == "maintenance":
        raise HTTPException(
            status_code=400,
            detail="Room is under maintenance"
        )

    # Check room capacity
    if room.occupied >= room.capacity:
        room.status = "full"
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="Room is full"
        )

    # Check if student already has an active allocation
    existing_allocation = db.query(models.Allocation).filter(
        models.Allocation.student_id == student_id,
        models.Allocation.is_active == True
    ).first()

    if existing_allocation:
        raise HTTPException(
            status_code=400,
            detail="Student already has an active room allocation"
        )

    # Create allocation
    new_allocation = models.Allocation(
        student_id=student_id,
        room_id=room_id,
        is_active=True
    )

    db.add(new_allocation)

    # Increase occupied count
    room.occupied += 1

    # Update room status
    if room.occupied >= room.capacity:
        room.status = "full"
    else:
        room.status = "available"

    db.commit()
    db.refresh(new_allocation)

    return new_allocation