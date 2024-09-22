import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import "./ResultPage.css";

const predefinedQuestions = [
  {
    question: "What is your favorite color?",
    options: ["Red", "Blue", "Green", "Yellow"],
  },
  {
    question: "What is your age range?",
    options: ["Under 18", "18-24", "25-34", "35-44", "45+"],
  },
  {
    question: "Which type of pet do you prefer?",
    options: ["Dog", "Cat", "Bird", "Fish"],
  },
];

const ResultPage = () => {
  const [answers, setAnswers] = useState(
    Array(predefinedQuestions.length).fill("")
  );
  const [fetchedQuestions, setFetchedQuestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);

  useEffect(() => {
    if (location.state) {
      const { lessonID, questionSet } = location.state;
  
      // API Call
      fetchQuestions(lessonID, questionSet);
    } else {
      console.error("No lessonID or questionSet provided");
    }
  }, [location.state]);
  
  const fetchQuestions = async (lessonID, questionSet) => {
    try {
      const token = localStorage.getItem("token");
      const payload = {
        Question_Set: questionSet,
        Lesson_ID: lessonID,
      };
      console.log(payload);
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
        body: JSON.stringify(payload), // ส่ง payload ที่นี่
      });
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const result = await response.json();
      setFetchedQuestions(result.List_Question); // Assuming the API returns a list of questions
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
    checkAnswers(); // ตรวจสอบคำตอบเมื่อส่งฟอร์ม
  };

  const checkAnswers = () => {
    const newResults = fetchedQuestions.map((question, index) => {
      const selectedAnswer = answers[index];
      const correctChoice = question.List_Choice.find(choice => choice.Is_Correct);
      return {
        questionText: question.QuestionText,
        selectedAnswer,
        isCorrect: selectedAnswer === correctChoice.Choice_Text,
        correctAnswer: correctChoice.Choice_Text
      };
    });
    setResults(newResults);
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
                      type="radio"
                      name={`question-${index}`}
                      value={choice.Choice_Text}
                      checked={answers[index] === choice.Choice_Text}
                      onChange={() => handleAnswerChange(index, choice.Choice_Text)}
                    />
                    {choice.Choice_Text} {choice.Is_Correct && <span>✅</span>}
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
              <div key={index} className={`result ${result.isCorrect ? 'correct' : 'incorrect'}`}>
                <p>คำถาม: {result.questionText}</p>
                <p>คำตอบที่เลือก: {result.selectedAnswer}</p>
                <p>{result.isCorrect ? "ถูกต้อง!" : `ผิด! คำตอบที่ถูกต้องคือ: ${result.correctAnswer}`}</p>
              </div>
            ))}
          </div>
        )}
      </form>
    </div>
  );
  
};


export default ResultPage;
