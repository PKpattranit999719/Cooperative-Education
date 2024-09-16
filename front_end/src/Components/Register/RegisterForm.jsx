import React from "react";
import "./RegisterForm.css";
import { FaUser } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

const RegisterForm = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Register</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required />
          <FaUser className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="E-mail Adress" required />
          <MdEmail className="icon" />
        </div>
        <div className="input-box">
          <input type="text" placeholder="Password" required />
          <FaLock className="icon" />
        </div>

        <div className="input-box">
          <input type="text" placeholder="Confirm Password" required />
          <FaLock className="icon" />
        </div>

        <div className="input-box">
          <div className="radio-group">
            <label>
              <input type="radio" name="role" value="teacher" required />
              Teacher
            </label>
            <label>
              <input type="radio" name="role" value="student" required />
              Student
            </label>
          </div>
        </div>

        <button type="submit">Register</button>

        {/* <div className="register-link">
          <p>
            Don't have an account? <a href="#">Register</a>
          </p>
        </div> */}
      </form>
    </div>
  );
};

export default RegisterForm;
