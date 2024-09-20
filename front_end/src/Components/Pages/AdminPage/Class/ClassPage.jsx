import React, { useState } from 'react';
import './ClassPage.css';
// Component สำหรับสร้าง Tab ของแต่ละชั้นเรียน
const ClassroomTabs = ({ activeTab, setActiveTab, setActiveClassroom }) => {
  // สร้าง state เพื่อควบคุม dropdown ของแต่ละปุ่ม
  const [dropdownOpen, setDropdownOpen] = useState({
    Grade1: false,
    Grade2: false,
    Grade3: false,
  });

  // ฟังก์ชันเปิด/ปิด dropdown
  const toggleDropdown = (grade) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [grade]: !prev[grade],
    }));
  };

  return (
    <div className="classroom-tabs">
      <div className="tab-link">
        <button className={`${activeTab === 'Grade1' ? 'active' : ''}`} onClick={() => toggleDropdown('Grade1')}>
          ชั้นประถมศึกษาปีที่ 1
        </button>
        {dropdownOpen.Grade1 && (
          <div className="dropdown">
            <button onClick={() => { setActiveTab('Grade1'); setActiveClassroom('Classroom 1A'); }}>
              ห้อง 1A
            </button>
            <button onClick={() => { setActiveTab('Grade1'); setActiveClassroom('Classroom 1B'); }}>
              ห้อง 1B
            </button>
          </div>
        )}
      </div>

      <div className="tab-link">
        <button className={`${activeTab === 'Grade2' ? 'active' : ''}`} onClick={() => toggleDropdown('Grade2')}>
          ชั้นประถมศึกษาปีที่ 2
        </button>
        {dropdownOpen.Grade2 && (
          <div className="dropdown">
            <button onClick={() => { setActiveTab('Grade2'); setActiveClassroom('Classroom 2A'); }}>
              ห้อง 2A
            </button>
            <button onClick={() => { setActiveTab('Grade2'); setActiveClassroom('Classroom 2B'); }}>
              ห้อง 2B
            </button>
          </div>
        )}
      </div>

      <div className="tab-link">
        <button className={`${activeTab === 'Grade3' ? 'active' : ''}`} onClick={() => toggleDropdown('Grade3')}>
          ชั้นประถมศึกษาปีที่ 3
        </button>
        {dropdownOpen.Grade3 && (
          <div className="dropdown">
            <button onClick={() => { setActiveTab('Grade3'); setActiveClassroom('Classroom 3A'); }}>
              ห้อง 3A
            </button>
            <button onClick={() => { setActiveTab('Grade3'); setActiveClassroom('Classroom 3B'); }}>
              ห้อง 3B
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Component สำหรับแสดงรายชื่อนักเรียนและปุ่ม "ดูคะแนนนักเรียน"
const ClassroomContent = ({ activeTab, activeClassroom }) => {
  // ตัวอย่างข้อมูลนักเรียนสำหรับแต่ละชั้นปีและห้องเรียน
  const studentData = {
    'Grade1-Classroom 1A': [
      { id: 1, name: 'นักเรียน ก1' },
      { id: 2, name: 'นักเรียน ก2' },
    ],
    'Grade1-Classroom 1B': [
      { id: 1, name: 'นักเรียน ข1' },
      { id: 2, name: 'นักเรียน ข2' },
    ],
    'Grade2-Classroom 2A': [
      { id: 1, name: 'นักเรียน ค1' },
      { id: 2, name: 'นักเรียน ค2' },
    ],
    'Grade2-Classroom 2B': [
      { id: 1, name: 'นักเรียน ง1' },
      { id: 2, name: 'นักเรียน ง2' },
    ],
    'Grade3-Classroom 3A': [
      { id: 1, name: 'นักเรียน จ1' },
      { id: 2, name: 'นักเรียน จ2' },
    ],
    'Grade3-Classroom 3B': [
      { id: 1, name: 'นักเรียน ฉ1' },
      { id: 2, name: 'นักเรียน ฉ2' },
    ],
  };

  const renderContent = () => {
    const key = `${activeTab}-${activeClassroom}`;
    const students = studentData[key] || [];

    return (
      <div>
        <h2>รายชื่อนักเรียน {activeClassroom}</h2>
        <table>
          <thead>
            <tr>
              <th>ลำดับ</th>
              <th>ชื่อนักเรียน</th>
              <th>การกระทำ</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td>{index + 1}</td>
                <td>{student.name}</td>
                <td>
                  <button onClick={() => alert(`ดูคะแนนของ ${student.name}`)}>
                    ดูคะแนนนักเรียน
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return <div className="tab-content">{renderContent()}</div>;
};

// Main Component สำหรับแสดง Tab และเนื้อหา
const Class = () => {
  const [activeTab, setActiveTab] = useState('Grade1');
  const [activeClassroom, setActiveClassroom] = useState('Classroom 1A');

  return (
    <>
      <ClassroomTabs activeTab={activeTab} setActiveTab={setActiveTab} setActiveClassroom={setActiveClassroom} />
      <ClassroomContent activeTab={activeTab} activeClassroom={activeClassroom} />
    </>
  );
};

export default Class;
