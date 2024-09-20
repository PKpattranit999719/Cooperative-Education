import React, { useState, useEffect } from "react";
import "./ClassPage.css";
// Component สำหรับสร้าง Tab ของแต่ละชั้นเรียน
const ClassroomTabs = ({ activeTab, setActiveTab, setActiveClassroom }) => {
  const [year1, setYear1] = useState("");
  const [year2, setYear2] = useState("");
  const [year3, setYear3] = useState("");
  const [student, setStudent] = useState("");

  // year 1
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
        setYear1(filteredRooms || []); // Update state with filtered data
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData1();
  }, []);

  // year 2
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
        const filteredRooms2 = result.List_Room.filter(
          (room) => room.Year === 2
        );
        setYear2(filteredRooms2 || []); // Update state with filtered data
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData2();
  }, []);

  // year 3
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
        const filteredRooms3 = result.List_Room.filter(
          (room) => room.Year === 3
        );
        setYear3(filteredRooms3 || []); // Update state with filtered data
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData3();
  }, []);

  // สร้าง state เพื่อควบคุม dropdown ของแต่ละปุ่ม
  const [dropdownOpen, setDropdownOpen] = useState({
    Grade1: false,
    Grade2: false,
    Grade3: false,
  });

  // ฟังก์ชันเปิด/ปิด dropdown
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
            {year1.map((year1, index) => (
              <button key={index} onClick={() => setActiveClassroom(year1.name)}>
                {year1.name} {/* Display room name */}
              </button>
            ))}
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
            {year2.map((year2, index) => (
              <button key={index} onClick={() => setActiveClassroom(year2.name)}>
                {year2.name} {/* Display room name */}
              </button>
            ))}
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
            {year3.map((year3, index) => (
              <button key={index} onClick={() => setActiveClassroom(year3.name)}>
                {year3.name} {/* Display room name */}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component สำหรับแสดงรายชื่อนักเรียนและปุ่ม "ดูคะแนนนักเรียน"
const ClassroomContent = ({ activeTab, activeClassroom }) => {
  // ตัวอย่างข้อมูลนักเรียนสำหรับแต่ละชั้นปีและห้องเรียน
  const studentData = {
    "Grade1-Classroom 1A": [
      { id: 1, name: "นักเรียน ก1" },
      { id: 2, name: "นักเรียน ก2" },
    ],
    "Grade1-Classroom 1B": [
      { id: 1, name: "นักเรียน ข1" },
      { id: 2, name: "นักเรียน ข2" },
    ],
    "Grade2-Classroom 2A": [
      { id: 1, name: "นักเรียน ค1" },
      { id: 2, name: "นักเรียน ค2" },
    ],
    "Grade2-Classroom 2B": [
      { id: 1, name: "นักเรียน ง1" },
      { id: 2, name: "นักเรียน ง2" },
    ],
    "Grade3-Classroom 3A": [
      { id: 1, name: "นักเรียน จ1" },
      { id: 2, name: "นักเรียน จ2" },
    ],
    "Grade3-Classroom 3B": [
      { id: 1, name: "นักเรียน ฉ1" },
      { id: 2, name: "นักเรียน ฉ2" },
    ],
  };

  const renderContent = () => {
    const key = `${activeTab}-${activeClassroom}`;
    const students = studentData[key] || [];

    return (
      <div>
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
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>
                  <button onClick={() => alert(`ดูคะแนนของ ${student.name}`)}>
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

  return <div className="tab-content">{renderContent()}</div>;
};

// Main Component สำหรับแสดง Tab และเนื้อหา
const Class = () => {
  const [activeTab, setActiveTab] = useState("Grade1");
  const [activeClassroom, setActiveClassroom] = useState("Classroom 1A");

  return (
    <>
      <ClassroomTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setActiveClassroom={setActiveClassroom}
      />
      <ClassroomContent
        activeTab={activeTab}
        activeClassroom={activeClassroom}
      />
    </>
  );
};

export default Class;
