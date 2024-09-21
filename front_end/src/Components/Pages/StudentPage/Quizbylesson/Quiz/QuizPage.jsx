import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./QuizPage.css";

const StudentQuize = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0); // State สำหรับเก็บคะแนน
  const [userAnswers, setUserAnswers] = useState([]); // State สำหรับเก็บคำตอบของผู้ใช้
  const [lessonID, setLessonID] = useState(null);
  const [questionSet, setQuestionSet] = useState(null);
  const [roomID, setRoomID] = useState(null);


  

  const fetchQuestions = async (lessonID, questionSet) => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Question_Set: questionSet,
          Lesson_ID: lessonID,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setQuestions(result.List_Question);
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
  };

  const handleNextQuestion = (choiceID, isCorrect) => {
    // เก็บคำตอบที่เลือกใน userAnswers
    setUserAnswers((prevAnswers) => [
      ...prevAnswers,
      { ID_Choice: choiceID }
    ]);

    // หากคำตอบถูกต้อง ให้เพิ่มคะแนน
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    if (currentQuestionIndex === questions.length - 1) {
      // หากเป็นคำถามสุดท้าย ให้ส่งข้อมูลไปยัง API
      submitQuiz();
    } else {
      // ไปยังคำถามถัดไป
      setCurrentQuestionIndex((prevIndex) =>
        Math.min(prevIndex + 1, questions.length - 1)
      );
    }
  };

  const submitQuiz = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");
      return;
    }

    const payload = {
      Score: score,
      total_question: questions.length,
      Date: new Date().toISOString().slice(0, 10), // ใช้วันที่ปัจจุบันในรูปแบบ yyyy-mm-dd
      UserID: localStorage.getItem("id"), // คุณสามารถใช้ข้อมูล UserID จริงได้ (ตรงนี้ควรดึงจาก localStorage หรือ state)
      Lesson_ID: lessonID,
      Question_set: questionSet,
      UserAns_List: userAnswers,
    };
    console.log(payload);

    try {
      const response = await fetch("http://localhost:8000/user/score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // เมื่อส่งสำเร็จ นำทางกลับไปยังหน้า lesson
      navigate("/lessonQuiz");
    } catch (error) {
      console.error("Submit error:", error.message);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    const { lessonID, questionSet } = location.state || {}; // ตรวจสอบให้แน่ใจว่า location.state มีค่า

    console.log('Received:', lessonID, questionSet); // เพิ่มการตรวจสอบที่นี่

    fetchQuestions(lessonID, questionSet );
    setLessonID(lessonID);
    setQuestionSet(questionSet);
  }, []);

  return (
    <>
      <Helmet>
        <title>Quiz Page</title>
      </Helmet>
      <div className="questions">
        <div className="lifeline-container">
          <p>
            <span className="mid mid-set-center mid-24px lifeline-icon"></span>2
          </p>
          <p>
            2:15
            <span className="mid mid-lightbuib-on-outline mid-24px lifeline-icon"></span>
            2
          </p>
        </div>
        <div>
          <p>
            <span>
              {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="mid mid-clock-outline mid-24px"></span>
          </p>
        </div>

        {currentQuestion ? (
          <div className="question-item">
            <h5>{currentQuestion.QuestionText}</h5>
            <div className="options-container">
              {currentQuestion.List_Choice.map((choice) => (
                <p
                  key={choice.ID_Choice}
                  className="option"
                  onClick={() =>
                    handleNextQuestion(choice.ID_Choice, choice.Is_Correct) // ส่ง choiceID และ isCorrect
                  }
                >
                  {choice.Choice_Text}
                </p>
              ))}
            </div>
          </div>
        ) : (
          <p>Loading questions...</p>
        )}

        <div className="button-container">
          <button onClick={submitQuiz}>Submit Quiz</button>
        </div>
      </div>
    </>
  );
};

export default StudentQuize;
