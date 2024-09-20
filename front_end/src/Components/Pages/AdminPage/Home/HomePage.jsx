import React, { useState, useEffect  } from 'react';
import './HomePage.css';
// import { FaBookReader } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
// import { PiStudent } from "react-icons/pi";

const Home = () => {
    const [showroom, setShowroom] = useState([]); // State for classrooms
    const [classRoom, setClassRoom] = useState('');


    useEffect(() => {
        const fetchRoomData = async () => {
          try {
            const token = localStorage.getItem("token");
            if (!token) {
              console.error("No token found");
              return;
            }
            const response = await fetch("http://localhost:8000/admin/myRoom", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });
    
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            
    
            setShowroom(result.List_Room);
    
            
          } catch (error) {
            console.error("Fetch error:", error.message);
          }
        };
    
        fetchRoomData();
      }, []);


    const handleCreateClass = async (e) => {
        const token = localStorage.getItem("token");
        const formData = {
            "Name_Room": classRoom
          }
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:8000/admin/room", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify(formData), 
            });
      
            const result = await response.json();
      
            if (response.ok) {
              
              console.log("Login successful:", result);
              window.location.reload();
            } else {
              
              console.log("Login failed:", result.detail);
            }
          } catch (error) {
            console.error("Error during login:", error);
          }
        
    };

    
    
    

    return (
        <div className='container'>
            <div className='form-group'>
                <div className='wrapper'>
                    <form onSubmit={handleCreateClass}>
                        <h2>Create Class</h2>
                        
                        <div className='input-box'>
                            <input
                                type="text"
                                placeholder='Name Room'
                                value={classRoom}
                                onChange={(e) => setClassRoom(e.target.value)}
                                required
                            />
                            <SiGoogleclassroom className='icon' />
                        </div>

                        <div className='button-group'>
                            <button type="button" className="cancel-button" onClick={() => {  setClassRoom(''); }}>Cancel</button>
                            <button type="submit" className="create-button">Create</button>
                        </div>
                    </form>
                </div>

                {/* <div className='wrapper'>
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
                </div> */}
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
                        {showroom.map((row) => (
                            <tr key={row.Room_ID}>
                                <td>{row.name}</td>
                                <td>{row.key}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* <h2>Students</h2>
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
                </table> */}
            </div>
        </div>
    );
};

export default Home;
