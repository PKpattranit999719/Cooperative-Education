import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import "./Lesson.css";

const Lesson = () => {
const navigate = useNavigate(); 

  const [lessons] = useState([
    {
      title: "Lesson-1",
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`,
    },
    {
      title: "Lesson-2",
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`,
    },
    {
      title: "Lesson-3",
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`,
    },
    {
      title: "Lesson-4",
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`,
    },
    {
      title: "Lesson-5",
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`,
    },
    {
      title: "Lesson-6",
      text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`,
    },
  ]);

  const handleExploreClick = () => {
    navigate("/quize"); // นำทางไปที่ /quize
  };

  return (
    <div className="container">
      <h1>Lesson</h1>
      <div className="button-group">
        <button className="bth">ประถมศึกษาปีที่ 1</button>
        <button className="bth">ประถมศึกษาปีที่ 2</button>
        <button className="bth">ประถมศึกษาปีที่ 3</button>
      </div>

      {/* Dropdown สำหรับชุดของข้อสอบ */}
      <div className="dropdown-group">
        <label htmlFor="exam-set">เลือกชุดของข้อสอบ:</label>
        <select id="exam-set" className="dropdown">
          <option value="ชุดที่ 1">ชุดที่ 1</option>
          <option value="ชุดที่ 2">ชุดที่ 2</option>
          <option value="ชุดที่ 3">ชุดที่ 3</option>
          <option value="ชุดที่คุณสร้าง">ชุดที่คุณสร้าง</option>
        </select>
      </div>

      <div className="lessons">
        {lessons.map((lesson, index) => (
          <div key={index} className="lesson">
            <h3>{lesson.title}</h3>
            <p>{lesson.text}</p>
            <button className="bth" onClick={handleExploreClick}>
              Explore
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Lesson;
