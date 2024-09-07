import React, { useState, useEffect } from 'react';
import '../../CSS/OpcCss/OpcCalendar.css';
import { BsCalendar2EventFill } from "react-icons/bs";
import { FaCalendarDay } from "react-icons/fa";
import { FaSortDown } from "react-icons/fa";
import { BiSolidRightArrow, BiSolidLeftArrow } from "react-icons/bi";

const OpcCalendar = () => {
  const currentDate = new Date();
  const [currentMonth, setCurrentMonth] = useState(currentDate.getMonth());
  const [currentYear, setCurrentYear] = useState(currentDate.getFullYear());
  const [selectedDay, setSelectedDay] = useState(currentDate.getDate());
  const [events, setEvents] = useState([]);
  const [expandedEvent, setExpandedEvent] = useState(null); // Add state for toggling description

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const daysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const generateDays = () => {
    const totalDays = daysInMonth(currentMonth, currentYear);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const days = [];
    const today = new Date(currentYear, currentMonth, currentDate.getDate());

    for (let i = 0; i < firstDay; i++) {
      days.push({ day: '', selected: false, disabled: true });
    }

    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const isPast = date < today;
      const isSelected = selectedDay === i && currentMonth === today.getMonth() && currentYear === today.getFullYear();
      days.push({ day: i, selected: isSelected, disabled: isPast, isPast });
    }

    return days;
  };

  const handleDayClick = async (day) => {
    if (day !== null) {
      const selectedDate = new Date(currentYear, currentMonth, day);
      setSelectedDay(day);
  
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); 
      const dayOfMonth = String(selectedDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}/${month}/${dayOfMonth}`;
  
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); 
        const response = await fetch(`http://localhost:8080/opc/events/getAll`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.ok) {
          const allEvents = await response.json();
          const dateEvents = allEvents.filter(event => {
            const eventDate = new Date(event.eventDate).toLocaleDateString();
            return eventDate === selectedDate.toLocaleDateString();
          });
          setEvents(dateEvents);
        } else {
          console.error('Failed to fetch events:', response.statusText);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  useEffect(() => {
    if (currentMonth === currentDate.getMonth() && currentYear === currentDate.getFullYear()) {
      setSelectedDay(currentDate.getDate());
    }
  }, [currentMonth, currentYear]);

  const toggleDescription = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  return (
    <div className="opc-calendar">
      <div className="opc-calendar-nav">
        <button 
          className='previous' 
          onClick={prevMonth} 
          disabled={currentYear === currentDate.getFullYear() && currentMonth === 0}
        >
          <BiSolidLeftArrow />
        </button>
        <div className="opc-calendar-month">
          {new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </div>
        <button 
          className='next' 
          onClick={nextMonth}
        >
          <BiSolidRightArrow />
        </button>
      </div>
      <div className="opc-calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="opc-calendar-day-name">{day}</div>
        ))}
        {generateDays().map((item, index) => (
          <div
            key={index}
            className={`opc-calendar-day${item.selected ? ' active' : ''}${item.disabled ? ' disabled' : ''}${item.isPast ? ' past' : ''}`}
            onClick={() => !item.disabled && handleDayClick(item.day)}
          >
            {item.day}
          </div>
        ))}
      </div>
      <div className='calendar-events'>
        <h2>
          <BsCalendar2EventFill style={{ marginBottom: "-2px", marginRight: "10px" }} /> Calendar Events
        </h2>
        <div className='calendar-events-content'>
          {events.length > 0 ? (
            events.map(event => (
              <div key={event.eventId} className="event-item">
                <h4 onClick={() => toggleDescription(event.eventId)}>
                🚩 {event.eventTitle} 
                <span style={{fontSize: "14px", fontWeight: '400', marginLeft: '85px'}}>
                  Click to view description <FaSortDown />
                </span>
                </h4>
                {expandedEvent === event.eventId && (
                  <div className="event-description">
                    <div className='details'>
                    <p><span style={{fontWeight: '700', marginRight: '5px'}}>
                      <FaCalendarDay style={{marginRight: '10px'}}/>                    
                      Date: </span> {new Date(event.eventDate).toLocaleDateString()}</p>
                    <p><span style={{fontWeight: '700', marginRight: '5px'}}>Description: </span>{event.eventDescription}
                    </p>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No events for this date.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpcCalendar;
