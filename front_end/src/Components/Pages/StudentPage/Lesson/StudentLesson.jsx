import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate
import "./StudentLesson.css";

const Lesson = () => {
  const navigate = useNavigate();
  const [lessons, setLesson] = useState([]); // ตั้งค่าเริ่มต้นเป็น array ว่าง
  const [Question_set, setQuestion_set] = useState("");



  useEffect(() => {
    const fetchLessonData = async () => {
     

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(
          `http://localhost:8000/user/scorebyuser`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await response.json();
        const filter = result;
        setQuestion_set(filter.Question_set)
        console.log("lessons");
        console.log(lessons);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setLesson(result || []); // ตรวจสอบว่ามีข้อมูลหรือไม่
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchLessonData();
  }, [ Question_set]); // เรียกใช้ฟังก์ชันเมื่อ RoomID หรือ Question_set เปลี่ยนแปลง


  const handleExploreClick = (ID_ScoreHistory) => {
    console.log(ID_ScoreHistory)
    navigate("/check", {
      state: {
        ID_ScoreHistory: ID_ScoreHistory,

      },
    });
  };


  return (
    <div className="lesson-container">
      <div className="lesson-wrapper">
        <h1>Lesson</h1>


        {/* แสดงรายการบทเรียน */}
        <div className="lessons">
          {lessons.map((row) => (
            <div key={row.LessonID} className="lesson">
              <h3>บทที่: {row.Lesson_ID} {row.Lesson}</h3>
              <p>จำนวนคำถาม: {row.total_question}</p>
              <p>ชุดข้อสอบ: {row.Question_set}</p>
              <button
                className="bth"
                onClick={() =>
                  handleExploreClick(row.ID_ScoreHistory)
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
