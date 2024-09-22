import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SidebarData } from "./SidebarData";

function Sidebar() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleClick = (path, sendId) => {
        if (sendId) {
            const userId = localStorage.getItem("id"); // ดึง userId
            const userName = localStorage.getItem("name"); // ดึง userId
            navigate(path, { state: { userId, userName } });   // ส่ง userId ไปใน state
        } else {
            navigate(path); // แค่ไปยัง path ถ้าไม่ต้องส่ง id
        }
    };

    return (
        <div>
        <ul className="side-menu">
          {SidebarData.map((item, index) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={index} className={isActive ? "active" : ""}>
                <Link to={item.path}>
                <span onClick={() => handleClick(item.path, item.sendId)} style={{ cursor: 'pointer' }}></span>
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
