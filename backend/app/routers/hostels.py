from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

import models
from database import get_db

router = APIRouter(
    prefix="/hostels",
    tags=["Hostels"]
)


# -------------------------
# GET ALL HOSTELS
# -------------------------

@router.get("/")
def get_hostels(db: Session = Depends(get_db)):
    hostels = db.query(models.Hostel).all()
    return hostels


# -------------------------
# GET HOSTEL BY ID
# -------------------------

@router.get("/{hostel_id}")
def get_hostel(
    hostel_id: int,
    db: Session = Depends(get_db)
):
    hostel = db.query(models.Hostel).filter(
        models.Hostel.id == hostel_id
    ).first()

    if not hostel:
        raise HTTPException(
            status_code=404,
            detail="Hostel not found"
        )

    return hostel


# -------------------------
# CREATE HOSTEL
# -------------------------

@router.post("/")
def create_hostel(
    name: str,
    location: str = None,
    description: str = None,
    total_rooms: int = 0,
    db: Session = Depends(get_db)
):
    new_hostel = models.Hostel(
        name=name,
        location=location,
        description=description,
        total_rooms=total_rooms
    )

    db.add(new_hostel)
    db.commit()
    db.refresh(new_hostel)

    return new_hostel