import React, { useState } from 'react';
import History from './History';
import "./History.css";

const Historypage = () => {
    const [selectedYear, setSelectedYear] = useState(null);

    const handleYearClick = (year) => {
        setSelectedYear(year);
    };

    return (
        <div className="history-container">
            <h1>History</h1>
            <div className="button-group">
                <button className="bth" onClick={() => handleYearClick(1)}>
                    ประถมศึกษาปีที่ 1
                </button>
                <button className="bth" onClick={() => handleYearClick(2)}>
                    ประถมศึกษาปีที่ 2
                </button>
                <button className="bth" onClick={() => handleYearClick(3)}>
                    ประถมศึกษาปีที่ 3
                </button>
            </div>
            {selectedYear && <History year={selectedYear} />} {/* ส่งค่า year ไปที่ History */}
        </div>
    );
};

export default Historypage;
