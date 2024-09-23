import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./quizcheck.css";

const QuizCheck = () => {
  const [answers, setAnswers] = useState([]);
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [total_question,settotal_question] = useState([0]);
  const [score,setscore] = useState([0]);

  useEffect(() => {
    if (location.state) {
      const { ID_ScoreHistory } = location.state;
      fetchQuestions(ID_ScoreHistory);
    } else {
      console.error("No ID_ScoreHistory provided");
    }
  }, [location.state]);

  const fetchQuestions = async (ID_ScoreHistory) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/user/dashboardscore/${ID_ScoreHistory}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      settotal_question(result.total_question);
      setscore(result.Score);
      console.log(result.Score);
      setFetchedQuestions(result.UserAns_List); // Assuming the API returns UserAns_List
      setAnswers(Array(result.UserAns_List.length).fill("")); // Set initial answers
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    checkAnswers();
  };

  const checkAnswers = () => {
    const newResults = fetchedQuestions.map((question) => {
      const selectedAnswer = question.ChoiceUserAns
        ? question.ChoiceUserAns.Choice_Text
        : null;
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

  const hasUserAnswered = (question) => {
    return question.ChoiceUserAns !== null; // Check if user has answered
  };

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <>
      <h1>คำถามทั้งหมด = {total_question}</h1>
      <h1>คะแนน = {score}</h1>
      <form onSubmit={handleSubmit} className="form-content">
        {fetchedQuestions.length > 0 ? (
          fetchedQuestions.map((question, index) => (
            <div key={index} className="question-card">
              <h2>
                ข้อที่ {index + 1}
                <span style={{ marginLeft: "500px" }}>
                  {question.ChoiceUserAns && question.ChoiceUserAns.Choice_Ans ? (
                    question.ChoiceUserAns.Choice_Ans.Is_Correct ? (
                      <span style={{ color: "green" }}>ถูก</span>
                    ) : (
                      <span style={{ color: "red" }}>ผิด</span>
                    )
                  ) : (
                    <span style={{ color: "red" }}>ผิด</span> // If no answer is selected
                  )}
                </span>
              </h2>
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
                    {choice.Choice_Text}
                    {hasUserAnswered(question) &&
                      choice.ID_Choice ===
                        question.ChoiceUserAns.Choice_Ans.ID_Choice && (
                        <span style={{ marginLeft: "10px" }}>
                          {" "}
                          คำตอบที่เคยเลือก👈
                        </span>
                      )}
                  </label>
                ))}
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

        {/* Back Button */}
        <div className="back-button-container" style={{ marginTop: "20px" }}>
          <button type="button" onClick={handleBackClick} className="back-button">
            ย้อนกลับ
          </button>
        </div>
      </form>
    </>
  );
};

export default QuizCheck;
