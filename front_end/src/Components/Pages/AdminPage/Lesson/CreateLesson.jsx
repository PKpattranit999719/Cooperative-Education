import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Createlesson.css';  // นำเข้าไฟล์ CSS สำหรับตกแต่ง

const Createlesson = () => {
  const [nameLesson, setNameLesson] = useState('');
  const [year, setYear] = useState(1);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const lessonData = {
      Name_Lesson: nameLesson,
      year: parseInt(year),
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        'http://localhost:8000/admin/lesson',
        lessonData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('สร้างบทเรียนสำเร็จ: ' + response.data.message);
      navigate('/upload');
    } catch (error) {
      console.error('Error creating lesson:', error);
      alert('การสร้างบทเรียนล้มเหลว');
    }
  };

  return (
    <div className="create-lesson-container">
      <h1 className="create-lesson-header">สร้างบทเรียนใหม่</h1>
      <form onSubmit={handleSubmit} className="create-lesson-form">
        <div className="form-group">
          <label>ชื่อบทเรียน:</label>
          <input
            type="text"
            value={nameLesson}
            onChange={(e) => setNameLesson(e.target.value)}
            required
            className="input-field"
          />
        </div>
        <div className="form-group">
          <label>ปีการศึกษา:</label>
          <div className="radio-group">
            <label className="radio-year">
              <input
                type="radio"
                value="1"
                checked={year === 1}
                onChange={() => setYear(1)}
              />
              ปี 1
            </label>
            <label className="radio-year">
              <input
                type="radio"
                value="2"
                checked={year === 2}
                onChange={() => setYear(2)}
              />
              ปี 2
            </label>
            <label className="radio-year">
              <input
                type="radio"
                value="3"
                checked={year === 3}
                onChange={() => setYear(3)}
              />
              ปี 3
            </label>
          </div>
        </div>
        <button type="submit" className="submit-button">
          สร้างบทเรียน
        </button>
      </form>
      <button className='back' onClick={() => navigate(-1)}>ย้อนกลับ</button>
    </div>
  );
};

export default Createlesson;
