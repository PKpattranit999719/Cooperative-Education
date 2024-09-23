import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Lessonquiz.css";

const LessonQuiz = () => {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]); 
  const [questionSet, setQuestionSet] = useState('1'); // ตั้งค่าเริ่มต้นให้กับ Question_set

  useEffect(() => {
    // สุ่มค่า Question_set ระหว่าง 1 ถึง 3
    const randomQuestionSet = Math.floor(Math.random() * 3) + 1;
    setQuestionSet(randomQuestionSet.toString());
  }, []);

  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        
        const response = await fetch(
          `http://localhost:8000/user/questionuser/`,
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
        console.log('API Result:', result); // ตรวจสอบค่าที่ได้รับ
        setLessons(result || []); // ตั้งค่า lessons
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchLessonData();
  }, [questionSet]); 

  const handleExploreClick = (lessonID, questionSet) => {
    console.log(`Lesson ID: ${lessonID}, Question Set: ${questionSet}`);
    navigate("/quiz", {
      state: {
        lessonID: lessonID,
        questionSet: questionSet,
      },
    });
  };

  // กรองบทเรียนตาม Question_set ที่สุ่มมา
  const filteredLessons = lessons.filter((lesson) => lesson.Question_set === parseInt(questionSet));

  return (
    <div className="lesson-container">
      <div className="lesson-wrapper">
        <h1>Quiz</h1>
        <div className="lessons">
          {filteredLessons.map((row) => (
            <div key={row.LessonID} className="lesson">
              <h3>บทที่: {row.LessonID} {row.Lesson}</h3>
              <p>จำนวนคำถาม: {row.TotalQuestion}</p>
              <p>ชุดข้อสอบ: {row.Question_set}</p>
              <button
                className="bth"
                onClick={() =>
                  handleExploreClick(row.LessonID, questionSet)
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
