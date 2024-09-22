import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './History.css'; // Assuming you have a CSS file for styling

const History = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const token = localStorage.getItem("token"); // ดึง token จาก localStorage
                const response = await axios.get('http://localhost:8000/admin/myRoom', {
                    headers: {
                        Authorization: `Bearer ${token}`, // ใส่ token ใน headers
                    },
                });
                console.log(response.data); // test
                // เข้าถึง List_Room
                setRooms(response.data.List_Room || []); // ตั้งค่าให้เป็น array จาก List_Room
            } catch (error) {
                console.error('Error fetching rooms:', error);
                setRooms([]); // ตั้งค่าเป็น array ว่างในกรณีเกิดข้อผิดพลาด
            }
        };
    
        fetchRooms();
    }, []);
    
    
    
    const handleButtonClick = (ID_Room, roomName) => {
        navigate(`/room/${ID_Room}`, { state: { roomName } });
    };

    return (
        <div>
            <div className="grade-group">
                <h2 className="grade-text">All Class</h2>
                <div className="button-group">
                    {rooms.length === 0 ? (
                        <p>No rooms available</p> // แสดงข้อความเมื่อไม่มีข้อมูล
                    ) : (
                        rooms.map(room => (
                            <button
                                key={room.Room_ID} // ใช้ Room_ID เป็น key
                                className='history-bth'
                                onClick={() => handleButtonClick(room.Room_ID, room.name)}
                            >
                                {room.name}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
    
    
};

export default History;