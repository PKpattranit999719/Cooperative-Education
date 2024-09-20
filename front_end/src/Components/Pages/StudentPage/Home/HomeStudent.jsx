import React, { useState, useEffect } from "react";
import "./HomeStudent.css";
import { SiGoogleclassroom } from "react-icons/si";

const Home = () => {
  const [showroom, setShowroom] = useState([]); // State for classrooms
  const [classRoom, setClassRoom] = useState("");
  const [hasRoomKey, setHasRoomKey] = useState(false); // State to check room in localStorage

  // Fetch Room Data
  useEffect(() => {
    const roomKeyFromStorage = localStorage.getItem("room");

    if (roomKeyFromStorage) {
      setHasRoomKey(true); // If room key is found in localStorage
    }

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

  // Function to handle submitting the room key
  const handleJoinClass = async (e) => {
    e.preventDefault();
  
    if (classRoom) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
  
        // Call the API with the room key
        const response = await fetch("http://localhost:8000/user/RoombyKey", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            Room_Key: classRoom, // Sending the room key
          }),
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const result = await response.json();
        console.log("API Response:", result);
  
        // Store the room key in localStorage if successful
        localStorage.setItem("room", classRoom);
        setHasRoomKey(true); // Set room key status to true after API call
      } catch (error) {
        console.error("Error joining class:", error.message);
      }
    }
  };
  

  return (
    <div className="home-container">
      <div className="form-group">
        <div className="wrapper">
          {!hasRoomKey ? (
            <form onSubmit={handleJoinClass}>
              <h2>Join Class</h2>
              <div className="input-box">
                <input
                  type="text"
                  placeholder="Enter your key"
                  value={classRoom}
                  onChange={(e) => setClassRoom(e.target.value)}
                  required
                />
                <SiGoogleclassroom className="icon" />
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setClassRoom("");
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="create-button">
                  Join
                </button>
              </div>
            </form>
          ) : (
            <div>
              <h2>Welcome to your Classroom</h2>
              <h3> {localStorage.getItem('room')}</h3>
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
};

export default Home;
