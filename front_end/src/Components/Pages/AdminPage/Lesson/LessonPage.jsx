import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import "./LessonPage.css";

const Lesson = () => {
  const navigate = useNavigate();
  const [lessons, setLesson] = useState([]); // ตั้งค่าเริ่มต้นเป็น array ว่าง
  const [showroom, setShowroom] = useState([]); // State for classrooms
  const [Question_set, setQuestion_set] = useState("1"); // State สำหรับ RoomID
  const [year, setYear] = useState("1"); // State สำหรับ Question_set

  useEffect(() => {
    const fetchLessonData = async () => {
      const formData = {
        Question_set: Question_set,
        year: year,
      };

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(
          "http://localhost:8000/questionset",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(formData),
          }
        );

        const result = await response.json();
        const filter = result;
        console.log(filter);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setLesson(result || []); // ตรวจสอบว่ามีข้อมูลหรือไม่
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchLessonData();
  }, [year, Question_set]); // เรียกใช้ฟังก์ชันเมื่อ RoomID หรือ Question_set เปลี่ยนแปลง

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
        setShowroom(result.List_Room || []); // ตรวจสอบว่ามีข้อมูลหรือไม่
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchRoomData();
  }, []);

  const handleExploreClick = (lessonID, questionSet) => {
    navigate("/result", {
      state: {
        lessonID: lessonID,
        questionSet: Question_set,
      },
    });
  };

  const handleYearClick = (year) => {
    setYear(year); // เก็บค่า year เมื่อเลือกห้อง
  };

  const handleQuestionSetChange = (event) => {
    setQuestion_set(event.target.value); // เก็บค่า Question_set จาก dropdown
  };

  return (
    <div className="lesson-container">
      <div className="lesson-wrapper">
        <h1>Lesson</h1>

      
        <div className="button-group">
          <button className="bth" value={1} onClick={() => handleYearClick(1)}>
            ประถมศึกษาปีที่ 1
          </button>
          <button className="bth" value={2} onClick={() => handleYearClick(2)}>
            ประถมศึกษาปีที่ 2
          </button>
          <button className="bth" value={3} onClick={() => handleYearClick(3)}>
            ประถมศึกษาปีที่ 3
          </button>
        </div>

        {/* Dropdown สำหรับชุดของข้อสอบ */}
        <div className="dropdown-group">
          <label htmlFor="exam-set">เลือกชุดของข้อสอบ:</label>
          <select
            id="exam-set"
            className="dropdown"
            onChange={handleQuestionSetChange}
          >
            <option value="1">ชุดที่ 1</option>
            <option value="2">ชุดที่ 2</option>
            <option value="3">ชุดที่ 3</option>
            <option value="3">ชุดที่คุณสร้าง</option>
          </select>
        </div>

        {/* แสดงรายการบทเรียน */}
        <div className="lessons">
          {lessons.map((row) => (
            <div key={row.LessonID} className="lesson">
              <h3>บทที่: {row.LessonID} {row.Lesson}</h3>
              <p>จำนวนคำถาม: {row.TotalQuestion}</p>
              <p>ชุดข้อสอบ: {Question_set}</p>
              <button
                className="bth"
                onClick={() =>
                  handleExploreClick(row.LessonID, row.Question_set)
                }
              >
                Explore
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lesson;
