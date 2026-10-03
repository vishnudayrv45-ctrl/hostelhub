import React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import RoomCard from "../components/RoomCard";
import API from "../services/api";

function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const response = await API.get("/rooms/");
      setRooms(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredRooms = rooms.filter((room) =>
    String(room.room_number)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <div className="page-content">

          <div className="page-title">
            <div>
              <h2>Rooms</h2>
              <p>View hostel room availability.</p>
            </div>

            <input
              className="search-input"
              placeholder="Search room..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="room-grid">

            {filteredRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
              />
            ))}

          </div>

          {filteredRooms.length === 0 && (
            <div className="empty-state">
              No rooms found.
            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Rooms;