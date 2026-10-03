import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
    { name: "Hostels", path: "/hostels", icon: "🏢" },
    { name: "Rooms", path: "/rooms", icon: "🚪" },
    { name: "Allocation", path: "/allocation", icon: "🛏️" },
    { name: "Complaints", path: "/complaints", icon: "🔧" },
    { name: "Transfers", path: "/transfers", icon: "🔄" },
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "Users", path: "/users", icon: "👥" },
  ];

  return (
    <aside className="sidebar">

      <div className="logo">
        <div className="logo-icon">H</div>
        <div>
          <h2>HostelHub</h2>
          <span>Management System</span>
        </div>
      </div>

      <nav className="side-nav">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            <span>{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <button className="logout-btn" onClick={logout}>
        🚪 Logout
      </button>

    </aside>
  );
}

export default Sidebar;