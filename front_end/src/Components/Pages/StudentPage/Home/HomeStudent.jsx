import React, { useState, useEffect } from "react";
import "./HomeStudent.css";
import { SiGoogleclassroom } from "react-icons/si";

const Home = () => {
  const [showroom, setShowroom] = useState(''); // State for classrooms
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
        const response = await fetch("http://localhost:8000/user/roomuser", {
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
        console.log(result);
        localStorage.setItem("year", result.Year);
        setShowroom(result);
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

  // Function to handle leaving the classroom
  const handleLeaveClass = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      console.log(showroom.Room_ID)
      // Call the API to leave the room
      const response = await fetch(`http://localhost:8000/user/DeleteUserRoom/${showroom.Room_ID}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Remove room key from localStorage after successful deletion
      localStorage.removeItem("room");
      setHasRoomKey(false); // Reset room key status
      setShowroom(""); // Clear the showroom data
      console.log("Successfully left the class");
    } catch (error) {
      console.error("Error leaving class:", error.message);
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
              <h3>📚 ห้องเรียน: {showroom.name}</h3>
              <h3>👨‍🏫 ชั้นประถมศึกษาปีที่: {showroom.Year}</h3>
              {/* Button to leave the classroom */}
              <button onClick={handleLeaveClass} className="leave-button">
                ออกจากห้องเรียน
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
