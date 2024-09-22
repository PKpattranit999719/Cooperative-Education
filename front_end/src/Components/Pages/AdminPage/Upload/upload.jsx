import React, { useState, useEffect } from "react";
import axios from "axios";

const Uploadpage = () => {
  const [file, setFile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null); // เก็บบทเรียนที่ถูกเลือก
  const [year, setYear] = useState(1); // เก็บปีที่เลือก เริ่มต้นที่ 1

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.post(
        "http://localhost:8000/admin/questionAll",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("อัปโหลดสำเร็จ: " + response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("การอัปโหลดล้มเหลว");
    }
  };

  // ฟังก์ชันดึงข้อมูลบทเรียนตามปีที่เลือก
  const fetchLessonsByYear = async (selectedYear) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.get(
        `http://127.0.0.1:8000/lesson/${selectedYear}`, // ส่งค่า year ไปใน API
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLessons(response.data);
    } catch (error) {
      console.error("Error fetching lessons by year:", error);
    }
  };

  // เรียก API ครั้งแรกเมื่อหน้าเว็บโหลด และดึงข้อมูลปีที่ 1
  useEffect(() => {
    fetchLessonsByYear(year);
  }, [year]); // ดึงข้อมูลใหม่ทุกครั้งที่ year เปลี่ยนแปลง

  return (
    <div>
      <h1>อัปโหลดและดาวน์โหลดไฟล์ CSV</h1>
      <input type="file" onChange={handleFileChange} accept=".csv" />
      <button onClick={handleUpload}>อัปโหลด</button>
      <a href="http://localhost:8000/download" download>
        ดาวน์โหลดไฟล์ CSV
      </a>

      <h2>เลือกปีการศึกษา</h2>
      <div>
        {/* ปุ่มสำหรับเลือกปี 1, 2, 3 */}
        {[1, 2, 3].map((y) => (
          <button key={y} onClick={() => setYear(y)} disabled={year === y}>
            ปี {y}
          </button>
        ))}
      </div>

      <h2>รายการบทเรียนสำหรับปี {year}</h2>
      <table border="1">
        <thead>
          <tr>
            <th>ID Lesson</th>
            <th>Name Lesson</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.ID_Lesson}>
              <td>{lesson.ID_Lesson}</td>
              <td>{lesson.name_lesson}</td>
              <td>{lesson.year}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
};

export default Uploadpage;
