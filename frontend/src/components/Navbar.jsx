import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user")) || {};
  } catch {
    user = {};
  }

  return (
    <header className="navbar">

      <div>
        <h1>Hostel Management</h1>
        <p>Manage your hostel efficiently</p>
      </div>

      <div className="nav-user" onClick={() => navigate("/profile")}>
        <div className="avatar">
          {(user.name || "U").charAt(0).toUpperCase()}
        </div>

        <div>
          <strong>{user.name || "User"}</strong>
          <small>{user.role || "student"}</small>
        </div>
      </div>

    </header>
  );
}

export default Navbar;