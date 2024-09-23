import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./ClassPage.css";

// Component for creating Tabs for each grade
const ClassroomTabs = ({
  activeTab,
  setActiveTab,
  setActiveClassroom,
  fetchUserData,
}) => {
  const [year1, setYear1] = useState([]);
  const [year2, setYear2] = useState([]);
  const [year3, setYear3] = useState([]);

  // Fetch year 1 data
  useEffect(() => {
    const fetchRoomData1 = async () => {
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
        const filteredRooms = result.List_Room.filter(
          (room) => room.Year === 1
        );
        setYear1(filteredRooms || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData1();
  }, []);

  // Similar fetching for year 2 and year 3
  useEffect(() => {
    const fetchRoomData2 = async () => {
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
        const filteredRooms = result.List_Room.filter(
          (room) => room.Year === 2
        );
        setYear2(filteredRooms || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData2();
  }, []);

  useEffect(() => {
    const fetchRoomData3 = async () => {
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
        const filteredRooms = result.List_Room.filter(
          (room) => room.Year === 3
        );
        setYear3(filteredRooms || []);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData3();
  }, []);
  
  const handleEvent = (id) => {
    console.log(id);
  };

  // Dropdown state for each grade
  const [dropdownOpen, setDropdownOpen] = useState({
    Grade1: false,
    Grade2: false,
    Grade3: false,
  });

  // Toggle dropdown
  const toggleDropdown = (grade) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [grade]: !prev[grade],
    }));
  };

  return (
    <div className="classroom-tabs">
      <div className="tab-link">
        <button
          className={`${activeTab === "Grade1" ? "active" : ""}`}
          onClick={() => toggleDropdown("Grade1")}
        >
          ชั้นประถมศึกษาปีที่ 1
        </button>
        {dropdownOpen.Grade1 && (
          <div className="dropdown">
            {year1.length === 0 ? (
              <p>ไม่มีข้อมูล</p>
            ) : (
              year1.map((room, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveClassroom(room.name); // Update active classroom
                    fetchUserData(room.Room_ID); // Fetch user data based on Room_ID
                  }}
                >
                  {room.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="tab-link">
        <button
          className={`${activeTab === "Grade2" ? "active" : ""}`}
          onClick={() => toggleDropdown("Grade2")}
        >
          ชั้นประถมศึกษาปีที่ 2
        </button>
        {dropdownOpen.Grade2 && (
          <div className="dropdown">
            {year2.length === 0 ? (
              <p>ไม่มีข้อมูล</p>
            ) : (
              year2.map((room, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveClassroom(room.name);
                    fetchUserData(room.Room_ID); // Fetch user data
                  }}
                >
                  {room.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      <div className="tab-link">
        <button
          className={`${activeTab === "Grade3" ? "active" : ""}`}
          onClick={() => toggleDropdown("Grade3")}
        >
          ชั้นประถมศึกษาปีที่ 3
        </button>
        {dropdownOpen.Grade3 && (
          <div className="dropdown">
            {year3.length === 0 ? (
              <p>ไม่มีข้อมูล</p>
            ) : (
              year3.map((room, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveClassroom(room.name);
                    fetchUserData(room.Room_ID); // Fetch user data
                  }}
                >
                  {room.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Component to display users and button for scores
const ClassroomContent = ({ activeTab, activeClassroom, users }) => {
  const navigate = useNavigate();
  const handleEvent = (id, name) => {
    console.log("user ID: " + id + " name: " + name);
    navigate('/score', { state: { userId: id, userName: name } });
  };

  return (
    <div className="tab-content">
      <h2>รายชื่อนักเรียน {activeClassroom}</h2>
      <table>
        <thead>
          <tr>
            <th>ลำดับ</th>
            <th>ชื่อนักเรียน</th>
            <th>การกระทำ</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.ID}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>
                <button onClick={() => handleEvent(user.ID, user.name)}>
                  ดูคะแนนนักเรียน
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Main Component
const Class = () => {
  const [activeTab, setActiveTab] = useState("");
  const [activeClassroom, setActiveClassroom] = useState("");
  const [users, setUsers] = useState([]); // State to hold user data

  // Function to fetch users based on Room_ID
  const fetchUserData = async (roomId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await fetch(
        `http://localhost:8000/admin/UserRoom/${roomId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setUsers(result || []); // Set the fetched user data
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  return (
    <div className="class-container">
      <h1 style={{ textAlign: "center", margin: "20px 0", color: "#fff" }}>Class</h1>
      <ClassroomTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setActiveClassroom={setActiveClassroom}
        fetchUserData={fetchUserData} // Pass fetch function to tabs
      />
      <ClassroomContent
        activeTab={activeTab}
        activeClassroom={activeClassroom}
        users={users} // Pass user data to content
      />
    </div>
  );
};

export default Class;
