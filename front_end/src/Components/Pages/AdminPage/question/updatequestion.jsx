import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Updatequestion.css';

const Updatequestion = () => {
    const { questionId } = useParams();
    const navigate = useNavigate();
    const [questionData, setQuestionData] = useState({
        ID_Question: 0,
        QuestionText: '',
        Lesson_ID: 0,
        Answer: '',
        Question_set: 0,
        List_Choice: [],
    });

    useEffect(() => {
        if (questionId) {
            fetchQuestionData(questionId);
        }
    }, [questionId]);

    const fetchQuestionData = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/questionbyid/${id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Error fetching question');
            }

            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                const question = data[0];
                setQuestionData({
                    ID_Question: question.ID_Question,
                    QuestionText: question.QuestionText,
                    Lesson_ID: question.ID_lesson,
                    Answer: question.Answer,
                    Question_set: question.Question_set,
                    List_Choice: question.List_Choice || [],
                });
            }
        } catch (error) {
            console.error('Error fetching question:', error);
        }
    };

    const handleInputChange = (e) => {
        setQuestionData({
            ...questionData,
            QuestionText: e.target.value,
        });
    };

    const handleChoiceChange = (index, value) => {
        const updatedChoices = [...questionData.List_Choice];
        updatedChoices[index].Choice_Text = value;
        setQuestionData({ ...questionData, List_Choice: updatedChoices });
    };

    const handleIsCorrectChange = (index) => {
        const updatedChoices = questionData.List_Choice.map((choice, idx) => ({
            ...choice,
            Is_Correct: idx === index, // ติ๊กแค่ choice ที่ถูกเลือก
        }));
        setQuestionData({ ...questionData, List_Choice: updatedChoices });
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8000/admin/question`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(questionData),
            });

            if (!response.ok) {
                throw new Error('Error updating question');
            }

            alert('Question updated successfully!');
            navigate(-1);
        } catch (error) {
            console.error('Error updating question:', error);
        }
    };

    return (
        <div className="update-question-container">
            <h1>Update Question</h1>
            <div>
                <label>Question Text:</label>
                <input
                    type="text"
                    value={questionData.QuestionText}
                    onChange={handleInputChange}
                />
            </div>
            <div>
                <h2>Choices:</h2>
                {questionData.List_Choice.map((choice, index) => (
                    <div className="choice-container" key={choice.ID_Choice}>
                        <input
                            type="text"
                            value={choice.Choice_Text}
                            onChange={(e) => handleChoiceChange(index, e.target.value)}
                        />
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={choice.Is_Correct}
                                onChange={() => handleIsCorrectChange(index)}
                            />
                            Correct
                        </label>
                    </div>
                ))}
            </div>
            <button onClick={handleUpdate}>Update Question</button>
            <button className='back' onClick={() => navigate(-1)}>ย้อนกลับ</button>
        </div>
    );
    
    
};

export default Updatequestion;
