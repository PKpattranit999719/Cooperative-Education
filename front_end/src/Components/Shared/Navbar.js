import React , {useState , useEffect} from "react";

import { Link } from "react-router-dom"; // เพิ่ม useNavigate

import "../../App.css";
import "./Navbar.css"
import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {
  const [name, setName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name");
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('room');
  };

  return (
    <div className="app-layout">
      <div className="navbar">
              <h1>EduQuest Game</h1>
        <div className="profile-logout">
          <b>{name ? name : "Guest"}</b>
          <Link to="/login" aria-label="Logout" onClick={handleLogout}>
            <FaSignOutAlt size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
