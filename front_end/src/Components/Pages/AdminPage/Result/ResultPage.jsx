import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ResultPage.css";

const ResultPage = () => {
  const [answers, setAnswers] = useState([]);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  // ดึงข้อมูลคำถามจาก backend เมื่อหน้าโหลด
  useEffect(() => {
    if (location.state) {
      const { lessonID, questionSet } = location.state;
      fetchQuestions(lessonID, questionSet);
    } else {
      console.error("No lessonID or questionSet provided");
    }
  }, [location.state]);

  // ฟังก์ชันดึงข้อมูลคำถามจาก API
  const fetchQuestions = async (lessonID, questionSet) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        Question_Set: questionSet,
        Lesson_ID: lessonID,
      };
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch("http://localhost:8000/question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setFetchedQuestions(result.List_Question);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  // ฟังก์ชันตรวจสอบคำตอบที่เลือก
  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  // ฟังก์ชันลบคำถาม
  const handleDeleteQuestion = async (questionId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(`http://localhost:8000/admin/question/${questionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete the question");
      }

      alert("คำถามถูกลบแล้ว");
      // ลบคำถามออกจาก fetchedQuestions หลังจากการลบ
      setFetchedQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== questionId)
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  // ฟังก์ชันนำทางไปหน้าแก้ไขคำถาม
  const handleUpdateQuestion = (questionId) => {
    navigate(`/updatequestion/${questionId}`);
  };

  // ฟังก์ชันส่งคำตอบและตรวจสอบคำตอบที่ถูกต้อง
  const handleSubmit = (e) => {
    e.preventDefault();
    checkAnswers();
  };

  // ตรวจสอบว่าคำตอบถูกหรือผิด
  const checkAnswers = () => {
    const newResults = fetchedQuestions.map((question, index) => {
      const selectedAnswer = answers[index];
      const correctChoice = question.List_Choice.find(
        (choice) => choice.Is_Correct
      );
      return {
        questionText: question.QuestionText,
        selectedAnswer,
        isCorrect: selectedAnswer === correctChoice.Choice_Text,
        correctAnswer: correctChoice.Choice_Text,
      };
    });
    setResults(newResults);
  };

  // ฟังก์ชันกลับไปหน้าก่อนหน้า
  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div>
      <h1>เฉลยคำตอบ</h1>
      <form onSubmit={handleSubmit} className="form-content">
        {fetchedQuestions.length > 0 ? (
          fetchedQuestions.map((question, index) => (
            <div key={index} className="question-card">
              <h2>ข้อที่ {index + 1}</h2>
              <label>{question.QuestionText}</label>
              <div className="options">
                {question.List_Choice.map((choice, optionIndex) => (
                  <label key={optionIndex} className="option-label">
                    <input
                      type="hidden"
                      name={`question-${index}`}
                      value={choice.Choice_Text}
                      checked={answers[index] === choice.Choice_Text}
                      onChange={() =>
                        handleAnswerChange(index, choice.Choice_Text)
                      }
                    />
                    {choice.Choice_Text} {choice.Is_Correct && <span>✅</span>}
                  </label>
                ))}
              </div>

              <div className="question-actions">
                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDeleteQuestion(question.ID_Question)} 

                >
                  ลบคำถาม
                </button>
                <button
                  type="button"
                  className="update-button"
                  onClick={() => handleUpdateQuestion(question.ID_Question)}
                >
                  อัปเดตคำถาม
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Loading questions...</p>
        )}

        {results.length > 0 && (
          <div className="results">
            <h2>Results:</h2>
            {results.map((result, index) => (
              <div
                key={index}
                className={`result ${result.isCorrect ? "correct" : "incorrect"}`}
              >
                <p>คำถาม: {result.questionText}</p>
                <p>คำตอบที่เลือก: {result.selectedAnswer}</p>
                <p>
                  {result.isCorrect
                    ? "ถูกต้อง!"
                    : `ผิด! คำตอบที่ถูกต้องคือ: ${result.correctAnswer}`}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="back-button-container" style={{ marginTop: "50px" }}>
          <button type="button" onClick={handleBackClick} className="back-button">
            ย้อนกลับ
          </button>
        </div>
      </form>
    </div>
  );
};

export default ResultPage;
