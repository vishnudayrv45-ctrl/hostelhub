import React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import API from "../services/api";

function Dashboard() {
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        hostelsRes,
        roomsRes,
        complaintsRes,
        transfersRes,
      ] = await Promise.all([
        API.get("/hostels/"),
        API.get("/rooms/"),
        API.get("/complaints/"),
        API.get("/transfers/"),
      ]);

      setHostels(hostelsRes.data);
      setRooms(roomsRes.data);
      setComplaints(complaintsRes.data);
      setTransfers(transfersRes.data);

    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  const occupied = rooms.reduce(
    (total, room) => total + (room.occupied || 0),
    0
  );

  const capacity = rooms.reduce(
    (total, room) => total + (room.capacity || 0),
    0
  );

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <div className="page-content">

          <div className="welcome-section">
            <div>
              <h2>Dashboard</h2>
              <p>
                Here's what's happening in your hostel today.
              </p>
            </div>
          </div>

          <div className="stats-grid">

            <StatCard
              title="Total Hostels"
              value={hostels.length}
              icon="🏢"
              description="Registered hostels"
            />

            <StatCard
              title="Total Rooms"
              value={rooms.length}
              icon="🚪"
              description={`${capacity} total beds`}
            />

            <StatCard
              title="Occupied Beds"
              value={occupied}
              icon="🛏️"
              description={`${capacity - occupied} available`}
            />

            <StatCard
              title="Complaints"
              value={complaints.length}
              icon="🔧"
              description="Total complaints"
            />

          </div>

          <div className="dashboard-grid">

            <div className="dashboard-panel">

              <h3>Room Overview</h3>

              {rooms.length === 0 ? (
                <div className="empty-state">
                  No rooms available.
                </div>
              ) : (
                <div className="mini-list">

                  {rooms.slice(0, 5).map((room) => (
                    <div className="mini-row" key={room.id}>

                      <div>
                        <strong>
                          Room {room.room_number}
                        </strong>

                        <span>
                          {room.occupied}/{room.capacity} occupied
                        </span>
                      </div>

                      <span className={`status ${room.status}`}>
                        {room.status}
                      </span>

                    </div>
                  ))}

                </div>
              )}

            </div>

            <div className="dashboard-panel">

              <h3>Recent Activity</h3>

              <div className="activity-list">

                <div className="activity">
                  <span>🔧</span>
                  <div>
                    <strong>Complaints</strong>
                    <p>{complaints.length} complaints recorded</p>
                  </div>
                </div>

                <div className="activity">
                  <span>🔄</span>
                  <div>
                    <strong>Transfers</strong>
                    <p>{transfers.length} transfer requests</p>
                  </div>
                </div>

                <div className="activity">
                  <span>🏢</span>
                  <div>
                    <strong>Hostels</strong>
                    <p>{hostels.length} hostels registered</p>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default Dashboard;