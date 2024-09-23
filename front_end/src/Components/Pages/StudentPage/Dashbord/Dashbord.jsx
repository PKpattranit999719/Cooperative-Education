import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "chart.js/auto";
import "./Dashboard.css";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = location.state || {};
  const userName = localStorage.getItem("name");

  const [classroom, setClassroom] = useState("");
  const [lessons, setLessons] = useState([]);
  const [doughnutCharts, setDoughnutCharts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึง ID ของผู้ใช้จาก localStorage
        const token = localStorage.getItem("token"); // ดึง token จาก localStorage
        const id = localStorage.getItem("id");
        const response = await axios.get(
          `http://localhost:8000/scorebylesson/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // ใส่ token ใน headers
            },
          }
        );

        const userData = response.data;

        // ตั้งค่าห้องเรียน
        setClassroom(userData.Room);

        // จัดการข้อมูลคะแนน
        const scores = userData.Score;

        // คำนวณคะแนนเฉลี่ยต่อบทเรียน
        const lessonScores = scores.reduce((acc, score) => {
          if (!acc[score.Lesson_ID]) {
            acc[score.Lesson_ID] = {
              total: 0,
              count: 0,
              max: score.total_question,
            };
          }
          acc[score.Lesson_ID].total += score.Score;
          acc[score.Lesson_ID].count += 1;
          return acc;
        }, {});

        const averaged = Object.keys(lessonScores).map((lessonId) => {
          const { total, count, max } = lessonScores[lessonId];
          return {
            lessonId: lessonId,
            average: total / count,
            max,
          };
        });

        setLessons(averaged);

        // เตรียมข้อมูลสำหรับกราฟ Doughnut
        const formattedDoughnutData = Object.keys(lessonScores).map(
          (lessonId) => {
            const scoreData = scores.filter(
              (score) => score.Lesson_ID === parseInt(lessonId)
            );
            const correct = scoreData.reduce(
              (acc, item) => acc + item.Score,
              0
            );
            const incorrect = scoreData.reduce(
              (acc, item) => acc + (item.total_question - item.Score),
              0
            );

            return {
              lessonId,
              correct,
              incorrect,
            };
          }
        );

        setDoughnutCharts(formattedDoughnutData);
      } catch (error) {
        console.error("Error fetching user scores:", error);
      }
    };

    fetchData();
  }, [userId]);

  return (
    <div className="score-container">
      <h1>ห้องเรียน: {classroom}</h1>
      <div className="user-section">
        <h2>คะแนนของนักเรียน: {userName} </h2>

        <div className="user-content">
          <div className="chart-container">
            <h3>กราฟแนวโน้มคะแนนเฉลี่ย</h3>
            <Line
              data={{
                labels: lessons.map((lesson) => `บทเรียน ${lesson.lessonId}`),
                datasets: [
                  {
                    label: "คะแนนที่ได้",
                    data: lessons.map((lesson) => lesson.average),
                    fill: false,
                    borderColor: `#${Math.floor(
                      Math.random() * 16777215
                    ).toString(16)}`,
                    backgroundColor: "rgba(0,0,0,0.1)",
                  },
                  {
                    label: "คะแนนเต็ม",
                    data: lessons.map((lesson) => lesson.max),
                    fill: false,
                    borderColor: "#FF5733",
                    borderDash: [5, 5],
                  },
                ],
              }}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "top",
                    labels: {
                      font: { size: 14, weight: "bold" },
                      color: "#000000",
                    },
                  },
                },
                scales: {
                  x: {
                    ticks: {
                      font: { size: 14, weight: "bold" },
                      color: "#000000",
                    },
                  },
                  y: {
                    ticks: {
                      font: { size: 14, weight: "bold" },
                      color: "#000000",
                    },
                    suggestedMax: 15,
                  },
                },
              }}
            />
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
                {lessons.map((lesson) => (
                  <tr key={lesson.lessonId}>
                    <td>{`บทเรียน ${lesson.lessonId}`}</td>
                    <td>{lesson.average.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={() => navigate(-1)}>ย้อนกลับ</button>
          </div>
        </div>
      </div>
      <h3>กราฟคะแนน</h3>
      <div className="doughnut-container">
        <div className="doughnut-charts">
          {doughnutCharts.map((lesson, index) => (
            <div
              key={lesson.lessonId}
              className={`doughnut-chart ${
                index % 2 === 0 ? "first" : "second"
              }`}
            >
              <h4>{`บทเรียน ${lesson.lessonId}`}</h4>
              <Doughnut
                data={{
                  labels: ["ถูก", "ผิด"],
                  datasets: [
                    {
                      data: [lesson.correct, lesson.incorrect],
                      backgroundColor: ["#4caf50", "#f44336"],
                      borderColor: "#ffffff",
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        font: { size: 14, weight: "bold" },
                        color: "#000000",
                      },
                    },
                  },
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
