import React, { useState } from 'react';
import axios from 'axios';

const Uploadpage = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert("กรุณาเลือกไฟล์ก่อนอัปโหลด");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
              console.error("No token found");
              return;
            }
            const response = await axios.post('http://localhost:8000/admin/questionAll', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`, // ตัวอย่างการใช้ token
                },
            });
            alert("อัปโหลดสำเร็จ: " + response.data.message);
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("การอัปโหลดล้มเหลว");
        }
    };

    return (
        <div>
            <h1>อัปโหลดและดาวน์โหลดไฟล์ CSV</h1>
            <input type="file" onChange={handleFileChange} accept=".csv" />
            <button onClick={handleUpload}>อัปโหลด</button>
            <a href="http://localhost:8000/download" download>ดาวน์โหลดไฟล์ CSV</a>
        </div>
    );
}

export default Uploadpage;