import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Modal from "react-modal";

const HistoryCharts = () => {
  const { ID_Room } = useParams();
  console.log(`ID_Room: ${ID_Room}`);
  const location = useLocation();
  const navigate = useNavigate();
  const roomNameFromState = location.state?.roomName || "";
  const [roomName, setRoomName] = useState(roomNameFromState);
  const [lessons, setLessons] = useState([]);
  const [year, setYear] = useState(null);

  const [selectedLesson, setSelectedLesson] = useState("");
  const [chartData, setChartData] = useState(null);
  const [chartData1, setChartData1] = useState(null);
  const [chartData2, setChartData2] = useState(null);
  const [chartData3, setChartData3] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    const fetchRoomName = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(`http://localhost:8000/room/${ID_Room}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json(); // แปลงเป็น JSON
        console.log("Room name response:", data); // ดูข้อมูลที่ตอบกลับ

        if (data && data.name && data.year) {
          console.log("Room Name:", data.name, "Year:", data.year);
          setRoomName(data.name);
          setYear(data.year);
        } else {
          console.error("Room name or year not found in response", data);
        }
      } catch (error) {
        console.error("Error fetching room name:", error);
      }
    };

    fetchRoomName();
  }, [ID_Room]);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const response = await fetch(`http://localhost:8000/lesson/${year}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Lessons response:", data);
        if (data) {
          setLessons(data);
        } else {
          console.error("Lessons not found in response");
        }
      } catch (error) {
        console.error("Error fetching lessons:", error);
      }
    };

    fetchLessons();
  }, [year]); // หาก `year` เปลี่ยนแปลง ให้เรียกฟังก์ชันอีกครั้ง

  //แท่ง
  const fetchBarChartData = async (questionSet, setChartData) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/admin/QuestionTureFalse",
        {
          LessonID: selectedLesson,
          RoomID: ID_Room,
          Question_set: questionSet,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(`API tests ${questionSet}:`, response.data);

      // ดึงข้อมูลคำถามจาก response
      const questions = response.data.Question;

      // สร้าง counts สำหรับ true และ false จากข้อมูลที่ได้
      const trueCounts = questions.map((q) => q.Is_Correct);
      const falseCounts = questions.map((q) => q.Is_NotCorrect);

      console.log("True Counts:", trueCounts);
      console.log("False Counts:", falseCounts);

      // ตั้งค่าป้ายชื่อสำหรับแต่ละคำถาม
      const labels = questions.map((q, index) => `ข้อ ${index + 1}`);

      // ตั้งค่าข้อมูลชาร์ต
      setChartData({
        labels,
        datasets: [
          {
            label: "ตอบถูก",
            data: trueCounts,
            backgroundColor: "rgba(112, 250, 105, 0.45)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
          },
          {
            label: "ตอบผิด",
            data: falseCounts,
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 1,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  useEffect(() => {
    if (selectedLesson) {
      fetchBarChartData(1, setChartData1);
      fetchBarChartData(2, setChartData2);
      fetchBarChartData(3, setChartData3);
    }
  }, [selectedLesson, ID_Room]);

  //วงกลม->แท่ง
  useEffect(() => {
    if (selectedLesson) {
      const fetchBarChartData = async () => {
        try {
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found");
            return;
          }
          const response = await axios.post(
            "http://127.0.0.1:8000/admin/meanscore",
            {
              LessonID: selectedLesson,
              RoomID: ID_Room,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log("API response for Bar Chart:", response.data);

          // ดึงข้อมูลคะแนนเฉลี่ย
          const meanScores = response.data.MeanScoreSet;
          const labels = meanScores.map((set) => `ชุด ${set.QuestionSet}`);
          const scores = meanScores.map((set) => set.MeanScore);

          // ตั้งค่าข้อมูลชาร์ต
          setChartData({
            labels,
            datasets: [
              {
                label: "คะแนนเฉลี่ยแต่ละชุด",
                data: scores,
                backgroundColor: [
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(255, 159, 64, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderColor: [
                  "rgba(75, 192, 192, 1)",
                  "rgba(255, 159, 64, 1)",
                  "rgba(153, 102, 255, 1)",
                ],
                borderWidth: 1,
              },
            ],
          });
        } catch (error) {
          console.error("Error fetching bar chart data:", error);
        }
      };

      fetchBarChartData();
    }
  }, [selectedLesson, ID_Room]);

  const chartOptionsBar1 = {
    scales: {
      x: {
        ticks: {
          padding: 10, // เพิ่มระยะห่างระหว่างข้อความในแกน X
          color: "#333", // เปลี่ยนสีฟอนต์ของแกน X
          font: {
            size: 14, // ขนาดฟอนต์ของแกน X
            weight: "bold", // น้ำหนักฟอนต์ของแกน X
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 0.5, // กำหนดช่วงของแกน Y
          color: "#333", // เปลี่ยนสีฟอนต์ของแกน Y
          font: {
            size: 14, // ขนาดฟอนต์ของแกน Y
            weight: "bold", // น้ำหนักฟอนต์ของแกน Y
          },
        },
        title: {
          display: true,
          text: "จำนวนนักเรียนในคลาส", // ข้อความที่ต้องการแสดง
          color: "#333", // เปลี่ยนสีฟอนต์ของชื่อแกน Y
          font: {
            size: 16, // ขนาดฟอนต์ของชื่อแกน Y
            weight: "bold", // น้ำหนักฟอนต์ของชื่อแกน Y
          },
        },
      },
    },
  };
  const chartOptionsBar = {
    scales: {
      x: {
        ticks: {
          padding: 10, // เพิ่มระยะห่างระหว่างข้อความในแกน X
          color: "#333", // เปลี่ยนสีฟอนต์ของแกน X
          font: {
            size: 14, // ขนาดฟอนต์ของแกน X
            weight: "bold", // น้ำหนักฟอนต์ของแกน X
          },
        },
        title: {
          display: true,
          text: "ชุดข้อสอบ",
          color: "#333", // เปลี่ยนสีฟอนต์ของชื่อแกน X
          font: {
            size: 16, // ขนาดฟอนต์ของชื่อแกน X
            weight: "bold", // น้ำหนักฟอนต์ของชื่อแกน X
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // กำหนดช่วงของแกน Y
          color: "#333", // เปลี่ยนสีฟอนต์ของแกน Y
          font: {
            size: 14, // ขนาดฟอนต์ของแกน Y
            weight: "bold", // น้ำหนักฟอนต์ของแกน Y
          },
        },
        title: {
          display: true,
          text: "จำนวนผู้ใช้ที่ได้คะแนนเกิน 9 คะแนน", // ข้อความที่ต้องการแสดง
          color: "#333", // เปลี่ยนสีฟอนต์ของชื่อแกน Y
          font: {
            size: 16, // ขนาดฟอนต์ของชื่อแกน Y
            weight: "bold", // น้ำหนักฟอนต์ของชื่อแกน Y
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#333", // เปลี่ยนสีฟอนต์ของคำอธิบายกราฟ
          font: {
            size: 14, // ขนาดฟอนต์ของคำอธิบายกราฟ
            weight: "bold", // น้ำหนักฟอนต์ของคำอธิบายกราฟ
          },
        },
      },
    },
  };
  const handleViewCharts = () => {
    navigate("/charts", { state: { ID_Room, selectedLesson } });
  };

  const openModal = async (questionSet) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            console.error("No token found");
            return;
        }
        console.log(questionSet);
        const response = await axios.post(
            "http://127.0.0.1:8000/user/ScoreUserAns",
            {
                LessonID: selectedLesson,
                RoomID: ID_Room,
                Question_set: questionSet,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        // ใช้ข้อมูลจาก response
        const data = response.data.Question; // สมมติว่า `Question` เป็น array ใน response
        const donutDataArray = data.map(question => {
            const labels = question.List_Choice.map(choice => choice.Choice_Text);
            const counts = question.List_Choice.map(choice => choice.Total_Ans);

            return {
                labels,
                datasets: [
                    {
                        data: counts,
                        backgroundColor: [
                            "rgba(255, 99, 132, 0.2)",
                            "rgba(54, 162, 235, 0.2)",
                            "rgba(255, 206, 86, 0.2)",
                            "rgba(75, 192, 192, 0.2)",
                        ],
                        borderColor: [
                            "rgba(255, 99, 132, 1)",
                            "rgba(54, 162, 235, 1)",
                            "rgba(255, 206, 86, 1)",
                            "rgba(75, 192, 192, 1)",
                        ],
                        borderWidth: 1,
                    },
                ],
            };
        });

        setModalContent(donutDataArray);
        setModalIsOpen(true);
    } catch (error) {
        console.error(`Error fetching data for question set ${questionSet}:`, error);
    }
};

  const closeModal = () => {
    setModalIsOpen(false);
    setModalContent("");
  };
  return (
    <div className="history-container">
      <div className="header-group">
        <h2 className="grade-text">ห้อง: {roomName}</h2>
        <div className="dropdown-group">
          <label htmlFor="lesson-select" className="dropdown-label">
            Lesson:
          </label>
          <select
            id="lesson-select"
            className="dropdown-select"
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
          >
            <option value="">--Lesson--</option>
            {lessons.map((lesson) => (
              <option key={lesson.ID_Lesson} value={lesson.ID_Lesson}>
                {lesson.name_lesson}
              </option>
            ))}
          </select>
        </div>
      </div>
      {chartData && (
        <div className="chart-container bar-chart-container">
          <Bar data={chartData} options={chartOptionsBar} />
          <h3>คะแนนเฉลี่ยแต่ละชุด</h3>
        </div>
      )}
      <div className="charts-wrapper">
        {chartData1 && (
          <div className="chart-container bar-chart-container">
            <Bar data={chartData1} options={chartOptionsBar1} />
            <div className="chart-header">
              <h3>กราฟแสดงชุดข้อสอบที่ 1</h3>
              <button onClick={() => openModal(1)}>ดูข้อมูลเพิ่มเติม</button>
            </div>
          </div>
        )}
        {chartData2 && (
          <div className="chart-container bar-chart-container">
            <Bar data={chartData2} options={chartOptionsBar1} />
            <div className="chart-header">
              <h3>กราฟแสดงชุดข้อสอบที่ 2</h3>
              <button onClick={() => openModal(2)}>ดูข้อมูลเพิ่มเติม</button>
            </div>
          </div>
        )}
        {chartData3 && (
          <div className="chart-container bar-chart-container">
            <Bar data={chartData3} options={chartOptionsBar1} />
            <div className="chart-header">
              <h3>กราฟแสดงชุดข้อสอบที่ 3</h3>
              <button onClick={() => openModal(3)}>ดูข้อมูลเพิ่มเติม</button>
            </div>
          </div>
        )}
      </div>
      {/* <button onClick={handleViewCharts}>ดูกราฟ</button> */}

      {/* <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="ข้อมูลเพิ่มเติม"
                ariaHideApp={false}
                className="modal-content"
            >
                <h2>ข้อมูลเพิ่มเติม</h2>
                {modalContent && <Doughnut data={modalContent} />}
                <button onClick={closeModal}>ปิด</button>
            </Modal> */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="ข้อมูลเพิ่มเติม"
        ariaHideApp={false}
        className="modal-content"
      >
        <h2>ข้อมูลเพิ่มเติม</h2>
        <div className="modal-body">
          {modalContent &&
            modalContent.map((data, index) => (
              <div key={index} className="donut-chart-container">
                <h3>ข้อ {index + 1}</h3>
                <Doughnut data={data} />
              </div>
            ))}
        </div>
        <button onClick={closeModal}>ปิด</button>
      </Modal>
    </div>
  );
};

export default HistoryCharts;
