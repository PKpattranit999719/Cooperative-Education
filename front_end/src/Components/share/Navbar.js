import React from "react";
import { Link, useLocation } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import "../App.css";
import { FaUser, FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const location = useLocation();

  return (
    <div className="app-layout">
      <div className="navbar">
        <div>
          <ul className="side-menu">
            {SidebarData.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={index} className={isActive ? "active" : ""}>
                  <Link to={item.path}>
                    <span className="icon">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
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
