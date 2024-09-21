import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { useLocation,useNavigate  } from 'react-router-dom';
import 'chart.js/auto';
import './Score.css'; 

const UserScore = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { userName, userId } = location.state || {}; // ดึงข้อมูล userName และ userId จากหน้าก่อน
    console.log("User Name:", userName);
    console.log("User ID:", userId);
    const [classroom, setClassroom] = useState({ name: 'ห้องเรียนอะไร', id: 1 });
    const [users, setUsers] = useState([]);
    const [lessons, setLessons] = useState([]);
    const [scores, setScores] = useState({});

    useEffect(() => {
        const fetchUsers = () => {
            
            const usersData = [
                { id: userId, name: userName },
            
            ];
            setUsers(usersData);
        };

        const fetchLessons = () => {
            
            const lessonsData = [
                { ID_Lesson: 1, name_lesson: 'การลบ' },
                { ID_Lesson: 2, name_lesson: 'บวก' },
                { ID_Lesson: 3, name_lesson: 'คูณ' },
                { ID_Lesson: 4, name_lesson: 'ครน' },
                { ID_Lesson: 5, name_lesson: 'พีระมิด' },
                { ID_Lesson: 6, name_lesson: 'สามเหลี่ยม' },
                { ID_Lesson: 7, name_lesson: 'ตีโกนaaaaaaaaffa' }
            ];
            setLessons(lessonsData);
        };

        const fetchScores = () => {
            
            const scoresData = {
                1: [
                    { lesson_id: 1, score: 85 },
                    { lesson_id: 2, score: 90 },
                    { lesson_id: 3, score: 78 },
                    { lesson_id: 4, score: 88 },
                    { lesson_id: 5, score: 92 },
                    { lesson_id: 6, score: 81 },
                    { lesson_id: 7, score: 85 }
                ],
                2: [
                    { lesson_id: 1, score: 88 },
                    { lesson_id: 2, score: 76 },
                    { lesson_id: 3, score: 95 },
                    { lesson_id: 4, score: 89 },
                    { lesson_id: 5, score: 90 },
                    { lesson_id: 6, score: 82 },
                    { lesson_id: 7, score: 87 }
                ],
                3: [
                    { lesson_id: 1, score: 92 },
                    { lesson_id: 2, score: 81 },
                    { lesson_id: 3, score: 85 },
                    { lesson_id: 4, score: 91 },
                    { lesson_id: 5, score: 93 },
                    { lesson_id: 6, score: 84 },
                    { lesson_id: 7, score: 88 }
                ]
            };
            setScores(scoresData);
        };

        fetchUsers();
        fetchLessons();
        fetchScores();
    }, [classroom.id]);

    return (
        <div>
            <h1>{classroom.name}</h1>
            {users.map(user => {
                const userScores = scores[user.id] || [];
                const chartData = {
                    labels: lessons.map(lesson => lesson.name_lesson),
                    datasets: [
                        {
                            label: user.name,
                            data: lessons.map(lesson => userScores.find(score => score.lesson_id === lesson.ID_Lesson)?.score || 0),
                            fill: false,
                            borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,//เปลี่ยนสีเส้นกาฟ
                        }
                    ],
                };

                const chartOptions = {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 14, 
                                    weight: 'bold' 
                                },
                                color: '#000000' //ตัวหนังสือที่ชื่อในรกฟา
                            }
                        },
                        tooltip: {
                            titleFont: {
                                size: 14, 
                                weight: 'bold' 
                            },
                            bodyFont: {
                                size: 14, 
                                weight: 'bold' 
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                font: {
                                    size: 14, 
                                    weight: 'bold' 
                                },
                                color: '#000000'//ตัวหนังสือที่กราฟ
                            }
                        },
                        y: {
                            ticks: {
                                font: {
                                    size: 14, 
                                    weight: 'bold' 
                                },
                                color: '#000000'//ตัวหนังสือกราฟ
                            }
                        }
                    }
                };

                return (
                    <div key={user.id} className="user-section">
                        <h2>คะแนนของ {user.name} (ID: {user.id})</h2>
                        
                        <div className="user-content">
                            <div className="chart-container">
                                <h3>กราฟคะแนน</h3>
                                <Line data={chartData} options={chartOptions} />
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
                                                <td>{userScores.find(score => score.lesson_id === lesson.ID_Lesson)?.score || 0}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default UserScore;