import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./QuizPage.css";

const StudentQuize = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [lessonID, setLessonID] = useState(null);
  const [questionSet, setQuestionSet] = useState(null);
  const [showScore, setShowScore] = useState(false);

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
    setUserAnswers((prevAnswers) => [...prevAnswers, { ID_Choice: choiceID }]);

    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
    }

    // ไปยังคำถามถัดไป
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
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
      Date: new Date().toISOString().slice(0, 10),
      UserID: localStorage.getItem("id"),
      Lesson_ID: lessonID,
      Question_set: questionSet,
      UserAns_List: userAnswers,
    };

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

      // เมื่อส่งคะแนนแล้วให้แสดงคะแนนเป็น pop-up
      alert(`Your Score: ${score} / ${questions.length}`);
      
      // เปลี่ยนสถานะ showScore เป็น true
      setShowScore(true);
    } catch (error) {
      console.error("Submit error:", error.message);
    }
  };

  useEffect(() => {
    const { lessonID, questionSet } = location.state || {};
    fetchQuestions(lessonID, questionSet);
    setLessonID(lessonID);
    setQuestionSet(questionSet);
  }, [location.state]);

  return (
    <>
      <Helmet>
        <title>Quiz Page</title>
      </Helmet>
      <div className="questions">
        <div>
          <p>
            {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* เงื่อนไขแสดงคำถามหรือคะแนน */}
          <>
            {questions.length > 0 && currentQuestionIndex < questions.length ? (
              <div className="question-item">
                <h5>{questions[currentQuestionIndex].QuestionText}</h5>
                <div className="options-container">
                  {questions[currentQuestionIndex].List_Choice.map((choice) => (
                    <p
                      key={choice.ID_Choice}
                      className="option"
                      onClick={() =>
                        handleNextQuestion(choice.ID_Choice, choice.Is_Correct)
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
              {/* ปุ่ม Return */}
              <button onClick={() => navigate(-1)} className="return-button">
                Return
              </button>

              {/* เงื่อนไขแสดงปุ่ม Submit หรือ Next Question */}
              {currentQuestionIndex === questions.length - 1 ? (
                <button onClick={submitQuiz} className="submit-button">
                  Submit Quiz
                </button>
              ) : (
                <button
                  onClick={() => handleNextQuestion(null, false)}
                  className="next-button"
                >
                  Next Question
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default StudentQuize;
