from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import models
from database import Base, engine
from app.routers import users, hostels, rooms, allocations, transfers, complaints, auth

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="HostelHub API",
    description="Hostel Management System",
    version="1.0.0"
)

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "Welcome to HostelHub API",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

app.include_router(users.router)
app.include_router(hostels.router)
app.include_router(rooms.router)
app.include_router(allocations.router)
app.include_router(transfers.router)
app.include_router(complaints.router)
app.include_router(auth.router)