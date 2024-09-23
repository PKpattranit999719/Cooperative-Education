import React, { useState, useEffect } from "react";
import axios from "axios";
import "./UploadPage.css";
import { Link } from "react-router-dom";

const Uploadpage = () => {
  const [file, setFile] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [year, setYear] = useState(1);

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

  const fetchLessonsByYear = async (selectedYear) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const response = await axios.get(
        `http://127.0.0.1:8000/lesson/${selectedYear}`,
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

  useEffect(() => {
    fetchLessonsByYear(year);
  }, [year]);

  return (
    <div className="upload-container">
      <h1>อัปโหลดและดาวน์โหลดไฟล์ CSV</h1>
      <div className="upload-section">
        <input className="input-file" type="file" onChange={handleFileChange} accept=".csv" />
        <button className="upload-button" onClick={handleUpload}>อัปโหลด</button>
        <a className="download-button-link" href="http://localhost:8000/download" download>
          <button className="download-button">ดาวน์โหลดไฟล์ CSV</button>
        </a>
      </div>
      <h2>เลือกปีการศึกษา</h2>
      <div className="button-container-year">
        <button className="year-button-1" onClick={() => setYear(1)}>ปี 1</button>
        <button className="year-button-2" onClick={() => setYear(2)}>ปี 2</button>
        <button className="year-button-3" onClick={() => setYear(3)}>ปี 3</button>
        <Link className="create-lesson-button-link" to="/createlesson">
          <button className="create-lesson-button">สร้างบทเรียน</button>
        </Link>
      </div>

      <h2>รายการบทเรียนสำหรับปี {year}</h2>
      <table>
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
