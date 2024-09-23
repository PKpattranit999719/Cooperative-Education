import React, { useEffect, useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { useLocation, useNavigate } from "react-router-dom";
import "chart.js/auto";
import "./Scores.css";

const Score = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userName, userId } = location.state || {};

  const [classroom, setClassroom] = useState("");
  const [lessons, setLessons] = useState([]);
  const [doughnutCharts, setDoughnutCharts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      console.log(userId);
      try {
        const token = localStorage.getItem("token"); // ดึง token จาก localStorage
        const response = await fetch(`http://localhost:8000/scorebylesson/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = await response.json(); // Assuming the response is in JSON format

        // Set classroom from API response
        setClassroom(userData.Room);

        const scores = userData.Score;

        // Calculate average scores per lesson and prepare doughnut data
        const lessonScores = scores.reduce((acc, score) => {
          if (!acc[score.Lesson_ID]) {
            acc[score.Lesson_ID] = {
              total: 0,
              count: 0,
              max: score.total_question,
            }; // Use actual total_question from API
          }
          acc[score.Lesson_ID].total += score.Score;
          acc[score.Lesson_ID].count += 1;
          return acc;
        }, {});

        // Create lesson array for only those present in API response
        const averaged = Object.keys(lessonScores).map((lessonId) => {
          const lessonData = lessonScores[lessonId];
          return {
            lessonId: parseInt(lessonId), // Convert to integer for correct sorting
            average: lessonData.total / lessonData.count,
            max: lessonData.max,
          };
        });

        setLessons(averaged);

        // Prepare data for Doughnut charts for each lesson
        const formattedDoughnutData = averaged.map((lesson) => {
          const lessonData = scores.find((score) => score.Lesson_ID === lesson.lessonId);
          return {
            lessonId: lesson.lessonId,
            correct: lessonData ? lessonData.Score : 0,
            incorrect: lessonData ? lessonData.total_question - lessonData.Score : 0,
          };
        });

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
                    borderColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
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
          </div>
        </div>
        <button onClick={() => navigate(-1)}>ย้อนกลับ</button>
      </div>
    </div>
  );
};

export default Score;
