import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import "./ResultPage.css";

const predefinedQuestions = [
    { question: "What is your favorite color?", options: ["Red", "Blue", "Green", "Yellow"] },
    { question: "What is your age range?", options: ["Under 18", "18-24", "25-34", "35-44", "45+"] },
    { question: "Which type of pet do you prefer?", options: ["Dog", "Cat", "Bird", "Fish"] },
];

const ResultPage = () => {
    const [answers, setAnswers] = useState(Array(predefinedQuestions.length).fill(""));

    const handleAnswerChange = (index, value) => {
        const updatedAnswers = [...answers];
        updatedAnswers[index] = value;
        setAnswers(updatedAnswers);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Form submitted with answers: ${JSON.stringify(answers)}`);
        console.log("Submitted Answers:", answers);
    };

    return (
        <form onSubmit={handleSubmit} className="form-content">
        {predefinedQuestions.map((question, index) => (
            <div key={index} className="question-card">
                <h2>Question {index + 1} of {predefinedQuestions.length}</h2>
                <label>{question.question}</label>
                <div className="options">
                    {question.options.map((option, optionIndex) => (
                        <label key={optionIndex} className="option-label">
                            <input
                                type="radio"
                                name={`question-${index}`}
                                value={option}
                                checked={answers[index] === option}
                                onChange={() => handleAnswerChange(index, option)}
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </div>
        ))}
        <button type="submit" className="btn">
            Submit
        </button>
    </form>    
    );
};

export default ResultPage;
