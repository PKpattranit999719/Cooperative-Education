import React, { useState, useEffect } from "react";
import "./HomeStudent.css";
// import { FaBookReader } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
// import { PiStudent } from "react-icons/pi";

const Home = () => {
  const [showroom, setShowroom] = useState([]); // State for classrooms
  const [classRoom, setClassRoom] = useState("");

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch("http://localhost:8000/admin/myRoom", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        setShowroom(result.List_Room);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData();
  }, []);

  

  return (
    <div className="home-container">
      <div className="form-group">
        <div className="wrapper">
          <form >
            <h2>Join Class</h2>

            <div className="input-box">
              <input
                type="text"
                placeholder="Enter your key"
                value={classRoom}
                onChange={(e) => setClassRoom(e.target.value)}
                required
              />
              <SiGoogleclassroom className="icon" />
            </div>
          

            <div className="button-group">
              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setClassRoom("");
                }}
              >
                Cancel
              </button>
              <button type="submit" className="create-button">
                Join
              </button>
            </div>
          </form>
        </div>

      </div>

      <div className="wrapper">
        <h2>Classrooms</h2>
        <table>
          <thead>
            <tr>
              <th>Class Name</th>
              <th>Keyroom</th>
              <th>ชั้นปีที่</th>
            </tr>
          </thead>
          <tbody>
            {showroom.map((row) => (
              <tr key={row.Room_ID}>
                <td>{row.name}</td>
                <td>{row.key}</td>
                <td>{row.Year}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default Home;
