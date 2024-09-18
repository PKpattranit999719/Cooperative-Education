import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../App.css";
import { SidebarData } from "./SidebarData";

function Sidebar() {
    const location = useLocation();
    return (
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
    )
}

export default Sidebar;

