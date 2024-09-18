import React, { useState } from 'react';
import './Lesson.css';

const Lesson = () => {
    const [lessons] = useState([
        {
            title: 'Lesson-1',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`
        },
        {
            title: 'Lesson-2',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`
        },
        {
            title: 'Lesson-3',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`
        },
        {
            title: 'lesson-4',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`
        },
        {
            title: 'lesson-5',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`
        },
        {
            title: 'lesson-6',
            text: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Molestias nemo iste eos,consequuntur pariatur quisquam ipsam?
                        Excepturi exercitationem possimus asperiores.`
        },
    ]);

    return (
        <div className='container'>
            <h1>Lesson</h1>
            <div className='lessons'>
                {lessons.map((lesson, index) => (
                    <div key={index} className='lesson'>
                        <h3>{lesson.title}</h3>
                        <p>{lesson.text}</p>
                        <button className='bth'>Explore</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Lesson;
