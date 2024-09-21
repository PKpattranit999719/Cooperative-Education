import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useLocation, useNavigate } from 'react-router-dom';
import 'chart.js/auto';
import './Scores.css';

const UserScore = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, userId } = location.state || {};
    
    const [classroom, setClassroom] = useState({ name: 'ห้องเรียนอะไร', id: 1 });
    const [lessons, setLessons] = useState([]);
    const [scores, setScores] = useState([]); // ตั้งเป็น array

    useEffect(() => {
        const fetchLessons = () => {
            const lessonsData = [
                { ID_Lesson: 1, name_lesson: 'การลบ' },
                { ID_Lesson: 2, name_lesson: 'บวก' },
                { ID_Lesson: 3, name_lesson: 'คูณ' },
                { ID_Lesson: 4, name_lesson: 'ครน' },
                { ID_Lesson: 5, name_lesson: 'พีระมิด' },
                { ID_Lesson: 6, name_lesson: 'สามเหลี่ยม' },
                { ID_Lesson: 7, name_lesson: 'ตีโกน' }
            ];
            setLessons(lessonsData);
        };

        const fetchScores = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await fetch(`http://localhost:8000/scorebylesson/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch scores");
                }

                const scoresData = await response.json();
                setScores(Array.isArray(scoresData) ? scoresData : []); // ตรวจสอบให้แน่ใจว่าเป็น array

            } catch (error) {
                console.error("Error fetching scores:", error);
                setScores([]); // ตั้งค่าเป็น array ว่างหากเกิดข้อผิดพลาด
            }
        };

        fetchLessons();
        fetchScores();
    }, [userId]);

    return (
        <div>
            <h1>{classroom.name}</h1>
            <div className="user-section">
                <h2>คะแนนของ {userName} (ID: {userId})</h2>
                
                <div className="user-content">
                    <div className="chart-container">
                        <h3>กราฟคะแนน</h3>
                        <Line
                            data={{
                                labels: lessons.map(lesson => lesson.name_lesson),
                                datasets: [{
                                    label: userName,
                                    data: lessons.map(lesson => {
                                        const scoreData = scores.find(score => score.lesson_id === lesson.ID_Lesson);
                                        return scoreData ? scoreData.score : 0; // ถ้าไม่มีให้คืนค่า 0
                                    }),
                                    fill: false,
                                    borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                                }]
                            }}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        labels: {
                                            font: { size: 14, weight: 'bold' },
                                            color: '#000000'
                                        }
                                    }
                                },
                                scales: {
                                    x: {
                                        ticks: {
                                            font: { size: 14, weight: 'bold' },
                                            color: '#000000'
                                        }
                                    },
                                    y: {
                                        ticks: {
                                            font: { size: 14, weight: 'bold' },
                                            color: '#000000'
                                        }
                                    }
                                }
                            }}
                        />
                        <button onClick={() => navigate(-1)}>ย้อนกลับ</button>
                    </div>

                    <div className="table-container">
                        <h3>ตารางคะแนน</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>บทเรียน</th>
                                    <th>คะแนน</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessons.map(lesson => (
                                    <tr key={lesson.ID_Lesson}>
                                        <td>{lesson.name_lesson}</td>
                                        <td>{scores.find(score => score.lesson_id === lesson.ID_Lesson)?.score || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserScore;
