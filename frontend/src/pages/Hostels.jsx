import React from "react";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../services/api";

function Hostels() {
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      const response = await API.get("/hostels/");
      setHostels(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="app-layout">

      <Sidebar />

      <main className="main-content">

        <Navbar />

        <div className="page-content">

          <div className="page-title">
            <div>
              <h2>Hostels</h2>
              <p>Manage all registered hostels.</p>
            </div>
          </div>

          <div className="card-grid">

            {hostels.map((hostel) => (
              <div className="data-card" key={hostel.id}>

                <div className="card-icon">
                  🏢
                </div>

                <h3>{hostel.name}</h3>

                <p>
                  📍 {hostel.location || "Location not specified"}
                </p>

                <p>
                  {hostel.description || "No description available."}
                </p>

                <div className="card-footer">
                  <span>Total Rooms</span>
                  <strong>{hostel.total_rooms}</strong>
                </div>

              </div>
            ))}

          </div>

          {hostels.length === 0 && (
            <div className="empty-state">
              No hostels found.
            </div>
          )}

        </div>

      </main>

    </div>
  );
}

export default Hostels;