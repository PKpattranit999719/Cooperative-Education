import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import { Link } from "react-router-dom";
import logo1 from '../../../../Components/Assets/logo1.png';

const Welcome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="welcome-body">
      <div className="wrapper">
        <h1>Welcome to EduQuest Game</h1>
        <img src={logo1} alt="EduQuest Logo" style={{ width: "200px", height: "auto" }} />
        <p>
          Welcome to EduQuest Game, an educational platform designed for early
          elementary school students to learn mathematics in a fun and
          interactive way. Join us to explore exciting challenges and sharpen
          your math skills!
        </p>

        <div className="register-link">
          <p>
            If you already have an account, please log in.{" "}
            <Link to="/login">Login</Link>
          </p>
        </div>

        <div className="register-link">
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
