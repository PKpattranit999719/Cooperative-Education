import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import "chart.js/auto";
import "./Dashboard.css";

const mockUserData = {
  Room: "Class A",
  Score: [
    { Lesson: "1", Score: 12 },
    { Lesson: "2", Score: 12 },
    { Lesson: "3", Score: 14 },
    { Lesson: "4", Score: 14 },
    { Lesson: "5", Score: 14 },
    { Lesson: "6", Score: 14 },
  ],
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, userId } = location.state || {};

  const [classroom, setClassroom] = useState("");
  const [lessons, setLessons] = useState([]);
  const [doughnutCharts, setDoughnutCharts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = mockUserData; // Use mock data

        setClassroom(userData.Room);
        const scores = userData.Score;

        const lessonScores = scores.reduce((acc, score) => {
          if (!acc[score.Lesson]) {
            acc[score.Lesson] = { total: 0, count: 0, max: 15 }; // Assume max score is 15
          }
          acc[score.Lesson].total += score.Score;
          acc[score.Lesson].count += 1;
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

        // Prepare data for Doughnut charts with specific mock values
        const doughnutData = {
          1: { correct: 8, incorrect: 4 }, // Specific mock values for Lesson 1
          2: { correct: 10, incorrect: 2 }, // Specific mock values for Lesson 2
          3: { correct: 12, incorrect: 2 },
          4: { correct: 12, incorrect: 2 },
          5: { correct: 12, incorrect: 2 },
          6: { correct: 12, incorrect: 2 },
        };

        const formattedDoughnutData = Object.keys(lessonScores).map(
          (lessonId) => {
            const { correct, incorrect } = doughnutData[lessonId] || {
              correct: 0,
              incorrect: 0,
            };
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
