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
    const [averagedScores, setAveragedScores] = useState({}); // เก็บคะแนนเฉลี่ย

    useEffect(() => {
        const fetchData = async () => {
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
                    throw new Error("Failed to fetch user data");
                }

                const userData = await response.json();
                const scores = userData.Score; // ดึงคะแนนจากข้อมูลที่ได้

                // คำนวณคะแนนเฉลี่ยสำหรับแต่ละบทเรียน
                const lessonScores = scores.reduce((acc, score) => {
                    if (!acc[score.Lesson]) {
                        acc[score.Lesson] = { total: 0, count: 0 };
                    }
                    acc[score.Lesson].total += score.Score;
                    acc[score.Lesson].count += 1;
                    return acc;
                }, {});

                // สร้างข้อมูลคะแนนเฉลี่ย
                const averaged = Object.keys(lessonScores).map(lessonId => ({
                    lessonId: lessonId,
                    average: lessonScores[lessonId].total / lessonScores[lessonId].count
                }));

                setLessons(averaged); // ตั้งค่าบทเรียนที่มีคะแนนเฉลี่ย

            } catch (error) {
                console.error("Error fetching user scores:", error);
            }
        };

        fetchData();
    }, [userId]);

    return (
        <div>
            <h1>{classroom.name}</h1>
            <div className="user-section">
                <h2>คะแนนของนักเรียน: {userName} </h2>

                <div className="user-content">
                    <div className="chart-container">
                        <h3>กราฟคะแนนเฉลี่ย</h3>
                        <Line
                            data={{
                                labels: lessons.map(lesson => `บทเรียน ${lesson.lessonId}`), // สร้างชื่อบทเรียน
                                datasets: [{
                                    label: userName,
                                    data: lessons.map(lesson => lesson.average), // ใช้ค่าเฉลี่ย
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
                        <h3>ตารางคะแนนเฉลี่ย</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>บทเรียน</th>
                                    <th>คะแนนเฉลี่ย</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lessons.map(lesson => (
                                    <tr key={lesson.lessonId}>
                                        <td>{`บทเรียน ${lesson.lessonId}`}</td>
                                        <td>{lesson.average.toFixed(2)}</td> {/* แสดงคะแนนเฉลี่ย */}
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
