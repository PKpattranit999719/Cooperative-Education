import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // เพิ่ม useNavigate
import "../../App.css";
import { SidebarData } from "./SidebarData";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    
    navigate("/login"); 
  };

  return (
    <div>
      <ul className="side-menu">
        {SidebarData.map((item, index) => {
          const isActive = location.pathname === item.path;

          // ตรวจสอบว่าเป็นรายการ Logout หรือไม่
          if (item.title === "Logout") {
            return (
              <li key={index} className={isActive ? "active" : ""}>
                {/* ใช้ onClick สำหรับการ logout */}
                <span className="nav-text logout" onClick={handleLogout}>
                  <span className="icon">{item.icon}</span>
                  <span>{item.title}</span>
                </span>
              </li>
            );
          }

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
  );
}

export default Sidebar;
