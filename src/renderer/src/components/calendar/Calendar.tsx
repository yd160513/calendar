// components/calendar/Calendar.tsx
import React from 'react';
import CalendarCell from './CalendarCell';
import { useCalendar } from '../../hooks/useCalendar';
import { useTime } from '../../hooks/useTime';
import { isSameDate } from '../../utils/date';
import { CalendarProps } from '../../types/calendar';
import '../../assets/calendar.css';

const Calendar: React.FC<CalendarProps> = ({ weekStartMonday = true }) => {
  const {
    today,
    currentYear,
    currentMonth,
    weekdayHeaders,
    calendarDays,
    navigate,
    goToToday,
    setToday
  } = useCalendar(weekStartMonday);

  // 每分钟更新时间
  useTime(setToday);

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <div className="controls-container">
          <div className="year-controls">
            <button onClick={() => navigate(-1)} className="nav-button">
              &lt;&lt;
            </button>
            <h2 className="current-year">{currentYear}年</h2>
            <button onClick={() => navigate(1)} className="nav-button">
              &gt;&gt;
            </button>
          </div>

          <div className="month-controls">
            <button onClick={() => navigate(0, -1)} className="nav-button">
              &lt;
            </button>
            <h3 className="month-title">{currentMonth + 1}月</h3>
            <button onClick={() => navigate(0, 1)} className="nav-button">
              &gt;
            </button>
          </div>
        </div>

        <button onClick={goToToday} className="today-button">
          回到今天
        </button>
      </div>

      <div className="calendar-grid">
        {weekdayHeaders.map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}

        {calendarDays.map((date, index) => (
          <CalendarCell
            key={index}
            date={date}
            isToday={isSameDate(date, today)}
            currentMonth={currentMonth}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
