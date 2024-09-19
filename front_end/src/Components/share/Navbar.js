import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import "./Navbar.css"
import { FaUser, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  };

  return (
    <div className="app-layout">
      <div className="navbar">
              <h1>EduQuest Game</h1>
        <div className="profile-logout">
          <Link to="/profile" aria-label="Profile">
            <FaUser size={20} />
          </Link>
          <Link to="/login" aria-label="Logout" onClick={handleLogout}>
            <FaSignOutAlt size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
