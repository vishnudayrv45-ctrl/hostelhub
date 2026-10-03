from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(
    prefix="/transfers",
    tags=["Transfers"]
)


# GET ALL TRANSFER REQUESTS
@router.get("/")
def get_transfer_requests(
    db: Session = Depends(get_db)
):
    return db.query(models.TransferRequest).all()


# GET ONE TRANSFER REQUEST
@router.get("/{transfer_id}")
def get_transfer_request(
    transfer_id: int,
    db: Session = Depends(get_db)
):
    transfer = db.query(models.TransferRequest).filter(
        models.TransferRequest.id == transfer_id
    ).first()

    if not transfer:
        raise HTTPException(
            status_code=404,
            detail="Transfer request not found"
        )

    return transfer


# CREATE TRANSFER REQUEST
@router.post("/")
def create_transfer_request(
    student_id: int,
    requested_room_id: int,
    reason: str,
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

    if student.role != "student":
        raise HTTPException(
            status_code=400,
            detail="Only students can request room transfers"
        )

    # Find student's current active allocation
    current_allocation = db.query(models.Allocation).filter(
        models.Allocation.student_id == student_id,
        models.Allocation.is_active == True
    ).first()

    if not current_allocation:
        raise HTTPException(
            status_code=400,
            detail="Student does not have an active room allocation"
        )

    # Check requested room
    requested_room = db.query(models.Room).filter(
        models.Room.id == requested_room_id
    ).first()

    if not requested_room:
        raise HTTPException(
            status_code=404,
            detail="Requested room not found"
        )

    # Cannot request same room
    if requested_room.id == current_allocation.room_id:
        raise HTTPException(
            status_code=400,
            detail="Student is already in this room"
        )

    # Requested room must have space
    if requested_room.status == "maintenance":
        raise HTTPException(
            status_code=400,
            detail="Requested room is under maintenance"
        )

    if requested_room.occupied >= requested_room.capacity:
        raise HTTPException(
            status_code=400,
            detail="Requested room is full"
        )

    # Create transfer request
    new_transfer = models.TransferRequest(
        student_id=student_id,
        current_room_id=current_allocation.room_id,
        requested_room_id=requested_room_id,
        reason=reason,
        status="pending"
    )

    db.add(new_transfer)
    db.commit()
    db.refresh(new_transfer)

    return new_transfer