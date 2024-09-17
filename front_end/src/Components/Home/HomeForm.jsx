import React from 'react';
import './HomeForm.css';
import { FaBookReader } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { PiStudent } from "react-icons/pi";

const HomeForm = () => {
    return (
        <div className='container'>
            {/* Create Class Form */}
            <div className='wrapper'>
                <form action=''>
                    <h1>Create Class</h1>
                    <div className='input-box'>
                        <input type="text" placeholder='Class Name' required />
                        <FaBookReader className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="text" placeholder='Room' required />
                        <SiGoogleclassroom className='icon' />
                    </div>

                    <div className='button-group'>
                        <button type="button">Cancel</button>
                        <button type="submit">Create</button>
                    </div>
                </form>
            </div>

            {/* Add Student Form */}
            <div className='wrapper'>
                <form action=''>
                    <h2>Add Student</h2>
                    <div className='input-box'>
                        <input type="text" placeholder='Student ID' required />
                        <PiStudent className='icon' />
                    </div>
                    <div className='input-box'>
                        <input type="text" placeholder='Room' required />
                        <SiGoogleclassroom className='icon' />
                    </div>

                    <div className='button-group'>
                        <button type="button">Cancel</button>
                        <button type="submit">Add</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HomeForm;
