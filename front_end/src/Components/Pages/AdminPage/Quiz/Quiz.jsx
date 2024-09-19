import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import "./Quiz.css";

const Quize = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [lessonID, setLessonID] = useState(null);
    const [questionSet, setQuestionSet] = useState(null);
    const [roomID, setRoomID] = useState(null);

    useEffect(() => {
        if (location.state) {
            const { lessonID, questionSet, roomID } = location.state;
            setLessonID(lessonID);
            setQuestionSet(questionSet);
            setRoomID(roomID);
            fetchQuestions(lessonID, questionSet, roomID);
        }
    }, [location.state]);

    const fetchQuestions = async (lessonID, questionSet, roomID) => {
        const token = localStorage.getItem("token");

        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            const response = await fetch('http://localhost:8000/question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    Room_ID: roomID,
                    Question_Set: questionSet,
                    Lesson_ID: lessonID
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            setQuestions(result.List_Question);
        } catch (error) {
            console.error("Fetch error:", error.message);
        }
    }

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
    }

    const handlePreviousQuestion = () => {
        setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    }

    const handleQuit = () => {
        navigate('/lesson'); // นำทางกลับไปที่หน้า Lesson
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <>
            <Helmet><title>Quiz Page</title></Helmet>
            <div className='questions'>
                <div className='lifeline-container'>
                    <p>
                        <span className='mid mid-set-center mid-24px lifeline-icon'></span>2
                    </p>
                    <p>
                        2:15<span className='mid mid-lightbuib-on-outline mid-24px lifeline-icon'></span>2
                    </p>
                </div>
                <div>
                    <p>
                        <span>{currentQuestionIndex + 1} of {questions.length}</span>
                        <span className="mid mid-clock-outline mid-24px"></span>
                    </p>
                </div>

                {currentQuestion ? (
                    <div className='question-item'>
                        <h5>{currentQuestion.QuestionText}</h5>
                        <div className='options-container'>
                            {currentQuestion.List_Choice.map((choice) => (
                                <p key={choice.ID_Choice} className='option'>
                                    {choice.Choice_Text}
                                    {choice.Is_Correct && ' (Correct)'}
                                </p>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Loading questions...</p>
                )}

                <div className='button-container'>
                    <button
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                    >
                        Next
                    </button>
                    <button onClick={handleQuit}>Quit</button>
                </div>
            </div>
        </>
    );
};

export default Quize;
