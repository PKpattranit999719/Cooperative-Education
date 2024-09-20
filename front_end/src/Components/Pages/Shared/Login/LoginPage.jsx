import React, { useState } from "react";
import "./LoginPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("username", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(), // Send the form data as URL-encoded string
      });

      const result = await response.json();

      if (response.ok) {
        // Handle successful login
        if(result.RoomID !== null){
          localStorage.setItem("room", result.RoomID);
        }
        console.log("Login successful:", result);
        localStorage.setItem("email", result.email);
        localStorage.setItem("name", result.name);
        localStorage.setItem("role", result.role);
        localStorage.setItem("id", result.ID);
        localStorage.setItem("token", result.access_token);
        if(result.role === 'user'){navigate('/homestudent')}
        else if(result.role === 'admin'){navigate('/home')}
      } else {
        // Handle login failure
        console.log("Login failed:", result.detail);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="login-body">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="E-mail Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <MdEmail className="icon" />
          </div>
          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
