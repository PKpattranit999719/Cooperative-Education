import React, { useState } from 'react';
import './HomeForm.css';
import { FaBookReader } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudent } from "react-icons/pi";

const HomeForm = () => {
    const [classrooms, setClassrooms] = useState([]); // State for classrooms
    const [students, setStudents] = useState([]); // State for students
    const [className, setClassName] = useState('');
    const [classRoom, setClassRoom] = useState('');
    const [studentId, setStudentId] = useState('');
    const [studentRoom, setStudentRoom] = useState('');

    const handleCreateClass = (e) => {
        e.preventDefault();
        setClassrooms([...classrooms, { name: className, room: classRoom }]);
        setClassName('');
        setClassRoom('');
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        setStudents([...students, { id: studentId, room: studentRoom }]);
        setStudentId('');
        setStudentRoom('');
    };

    return (
        <div className='container'>
            <div className='form-group'>
                <div className='wrapper'>
                    <form onSubmit={handleCreateClass}>
                        <h1>Create Class</h1>
                        <div className='input-box'>
                            <input
                                type="text"
                                placeholder='Class Name'
                                value={className}
                                onChange={(e) => setClassName(e.target.value)}
                                required
                            />
                            <FaBookReader className='icon' />
                        </div>
                        <div className='input-box'>
                            <input
                                type="text"
                                placeholder='Room'
                                value={classRoom}
                                onChange={(e) => setClassRoom(e.target.value)}
                                required
                            />
                            <SiGoogleclassroom className='icon' />
                        </div>

                        <div className='button-group'>
                            <button type="button" className="cancel-button" onClick={() => { setClassName(''); setClassRoom(''); }}>Cancel</button>
                            <button type="submit" className="create-button">Create</button>
                        </div>
                    </form>
                </div>

                <div className='wrapper'>
                    <form onSubmit={handleAddStudent}>
                        <h2>Add Student</h2>
                        <div className='input-box'>
                            <input
                                type="text"
                                placeholder='Student ID'
                                value={studentId}
                                onChange={(e) => setStudentId(e.target.value)}
                                required
                            />
                            <PiStudent className='icon' />
                        </div>
                        <div className='input-box'>
                            <input
                                type="text"
                                placeholder='Room'
                                value={studentRoom}
                                onChange={(e) => setStudentRoom(e.target.value)}
                                required
                            />
                            <SiGoogleclassroom className='icon' />
                        </div>

                        <div className='button-group'>
                            <button type="button" className="cancel-button" onClick={() => { setStudentId(''); setStudentRoom(''); }}>Cancel</button>
                            <button type="submit" className="create-button">Add</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className='wrapper'>
                <h2>Classrooms</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Class Name</th>
                            <th>Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        {classrooms.map((classroom, index) => (
                            <tr key={index}>
                                <td>{classroom.name}</td>
                                <td>{classroom.room}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <h2>Students</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Student ID</th>
                            <th>Room</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((student, index) => (
                            <tr key={index}>
                                <td>{student.id}</td>
                                <td>{student.room}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HomeForm;
