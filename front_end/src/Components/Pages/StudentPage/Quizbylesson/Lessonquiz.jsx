import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Lessonquiz.css";

const LessonQuiz = () => {
  const navigate = useNavigate();
  const [lessons, setLesson] = useState([]); 
  const [Question_set, setQuestion_set] = useState('1'); // ตั้งค่าเริ่มต้นให้กับ Question_set

  useEffect(() => {
    // สุ่มค่า Question_set ระหว่าง 1 ถึง 3
    const randomQuestionSet = Math.floor(Math.random() * 3) + 1;
    setQuestion_set(randomQuestionSet.toString());
  }, []);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        
        const payload = {
          Question_set: Question_set,
          year: localStorage.getItem("year"),
        };
        
        const response = await fetch(
          `http://localhost:8000/questionset/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('API Result:', result); // ตรวจสอบค่าที่ได้รับ
        setLesson(result || []); // ตั้งค่า lessons

        // เช็คว่า Question_set มีอยู่ในผลลัพธ์หรือไม่
        if (result && result.Question_set) {
          setQuestion_set(result.Question_set); 
        }
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    if (Question_set) {
      fetchLessonData();
    }
  }, [Question_set]); 

  const handleExploreClick = (lessonID, questionSet) => {
    console.log(`Lesson ID: ${lessonID}, Question Set: ${questionSet}`);
    navigate("/quiz", {
      state: {
        lessonID: lessonID,
        questionSet: questionSet,
      },
    });
  };

  return (
    <div className="lesson-container">
      <div className="lesson-wrapper">
        <h1>Quize</h1>
        <div className="lessons">
          {lessons.map((row) => (
            <div key={row.LessonID} className="lesson">
              <h3>{row.Lesson}</h3>
              <p>จำนวนคำถาม: {row.TotalQuestion}</p>
              <p>ชุดข้อสอบ: {Question_set}</p>
              <button
                className="bth"
                onClick={() =>
                  handleExploreClick(row.LessonID, Question_set)
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

export default LessonQuiz;
