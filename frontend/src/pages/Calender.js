import React, { useState } from "react";
import "./Calender.css"; // Import the CSS file

const Calender = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);
const eventData = JSON.parse(localStorage.getItem("events")) || {};
console.log("dataa",eventData)
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const handleDateClick = (day) => {
    const selected = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    setSelectedDate(selected);
    console.log("Selected Date:", selected);
  };

  const handleMouseOver = (dateKey) => {
    setHoveredDate(dateKey);
  };

  const handleMouseOut = () => {
    setHoveredDate(null);
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = getFirstDayOfMonth(year, month);
    const totalDays = daysInMonth(year, month);

    let days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const dateKey = `${year}-${(month + 1).toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;

      days.push(
        <div
          key={day}
          className={`calendar-day ${selectedDate === dateKey ? "selected" : ""} ${
            eventData[dateKey] ? "has-event" : ""
          }`}
          onClick={() => handleDateClick(day)}
          onMouseOver={() => handleMouseOver(dateKey)}
          onMouseOut={handleMouseOut}
        >
          {day}
          {eventData[dateKey] && <span className="event-dot"></span>}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="calendar-container">
    <div className="calendar-content">
      <div className="calendar-header">
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}>
          ◀
        </button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
        </h2>
        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}>
          ▶
        </button>
      </div>
  
      <div className="calendar-grid">
        <div className="day-label">Sun</div>
        <div className="day-label">Mon</div>
        <div className="day-label">Tue</div>
        <div className="day-label">Wed</div>
        <div className="day-label">Thu</div>
        <div className="day-label">Fri</div>
        <div className="day-label">Sat</div>
  
        {renderCalendar()}
      </div>
  
      {hoveredDate && (
        <div className="hover-card">
          <h3>Events on {hoveredDate}:</h3>
          {eventData[hoveredDate] ? (
            <ul>
              {eventData[hoveredDate].map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      )}
  
      {selectedDate && (
        <div className="event-list">
          <h3>Events on {selectedDate}:</h3>
          {eventData[selectedDate] ? (
            <ul>
              {eventData[selectedDate].map((event, index) => (
                <li key={index}>{event}</li>
              ))}
            </ul>
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      )}
    </div>
  </div>
  





  );
};

export default Calender;
