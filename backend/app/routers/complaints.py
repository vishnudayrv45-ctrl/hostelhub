from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(
    prefix="/complaints",
    tags=["Complaints"]
)


# GET ALL COMPLAINTS
@router.get("/")
def get_complaints(
    db: Session = Depends(get_db)
):
    return db.query(models.Complaint).all()


# GET ONE COMPLAINT
@router.get("/{complaint_id}")
def get_complaint(
    complaint_id: int,
    db: Session = Depends(get_db)
):
    complaint = db.query(models.Complaint).filter(
        models.Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    return complaint


# CREATE COMPLAINT
@router.post("/")
def create_complaint(
    student_id: int,
    title: str,
    description: str,
    room_id: int = None,
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
            detail="Only students can submit complaints"
        )

    # Check room if provided
    if room_id is not None:
        room = db.query(models.Room).filter(
            models.Room.id == room_id
        ).first()

        if not room:
            raise HTTPException(
                status_code=404,
                detail="Room not found"
            )

    # Create complaint
    new_complaint = models.Complaint(
        student_id=student_id,
        room_id=room_id,
        title=title,
        description=description,
        status="pending"
    )

    db.add(new_complaint)
    db.commit()
    db.refresh(new_complaint)

    return new_complaint


# UPDATE COMPLAINT STATUS
@router.put("/{complaint_id}/status")
def update_complaint_status(
    complaint_id: int,
    status: str,
    db: Session = Depends(get_db)
):

    complaint = db.query(models.Complaint).filter(
        models.Complaint.id == complaint_id
    ).first()

    if not complaint:
        raise HTTPException(
            status_code=404,
            detail="Complaint not found"
        )

    allowed_statuses = [
        "pending",
        "in_progress",
        "resolved",
        "rejected"
    ]

    if status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Invalid complaint status"
        )

    complaint.status = status

    if status == "resolved":
        complaint.resolved_at = datetime.utcnow()
    else:
        complaint.resolved_at = None

    db.commit()
    db.refresh(complaint)

    return complaint