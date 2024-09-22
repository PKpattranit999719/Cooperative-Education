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
                <button className="bth" value={1} onClick={() => handleYearClick(1)}>
                    ประถมศึกษาปีที่ 1
                </button>
                <button className="bth" value={2} onClick={() => handleYearClick(2)}>
                    ประถมศึกษาปีที่ 2
                </button>
                <button className="bth" value={3} onClick={() => handleYearClick(3)}>
                    ประถมศึกษาปีที่ 3
                </button>
            </div>
            <History year={selectedYear} />
        </div>
    );
};

export default Historypage;
