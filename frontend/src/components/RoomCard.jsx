import React from "react";
function RoomCard({ room }) {
  const available = room.capacity - room.occupied;

  return (
    <div className="room-card">

      <div className="room-header">
        <h3>Room {room.room_number}</h3>

        <span className={`status ${room.status}`}>
          {room.status}
        </span>
      </div>

      <p>Floor: {room.floor ?? "N/A"}</p>

      <div className="room-info">
        <span>Capacity</span>
        <strong>{room.capacity}</strong>
      </div>

      <div className="room-info">
        <span>Occupied</span>
        <strong>{room.occupied}</strong>
      </div>

      <div className="room-info">
        <span>Available</span>
        <strong>{available}</strong>
      </div>

    </div>
  );
}

export default RoomCard;