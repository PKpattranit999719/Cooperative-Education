import React, { useState } from "react";
import "./Register.css";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบรหัสผ่าน
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const url =
      role === "teacher"
        ? "http://localhost:8000/admin"
        : "http://localhost:8000/user";

    // const formData = new URLSearchParams();
    // formData.append("email", email);
    // formData.append("name", username);
    // formData.append("password", password);

    const payload = {
      email: email,
      name: username,
      password: password,
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration successful:", result);
        navigate("/login");
      } else {
        console.error("Registration failed:", await response.json());
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="register-body">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <FaUser className="icon" />
          </div>
          <div className="input-box">
            <input
              type="email"
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
          <div className="input-box">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
          </div>
          <div className="input-box">
            <div className="radio-group">
              <label>
                <input
                  type="radio"
                  name="role"
                  value="teacher"
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                Teacher
              </label>
              <label>
                <input
                  type="radio"
                  name="role"
                  value="student"
                  onChange={(e) => setRole(e.target.value)}
                  required
                />
                Student
              </label>
            </div>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};
export default Register;
