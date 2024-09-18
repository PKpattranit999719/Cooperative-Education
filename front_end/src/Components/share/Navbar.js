import React from "react";
import { Link } from "react-router-dom";
import "../../App.css";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

function Navbar() {

  return (
    <div className="app-layout">
      <div className="navbar">
              <h1>EduQuest Game</h1>
        <div className="profile-logout">
          <Link to="/profile" aria-label="Profile">
            <FaUser size={20} />
          </Link>
          <Link to="/logout" aria-label="Logout">
            <FaSignOutAlt size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
