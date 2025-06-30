import React, { useState, useEffect, useMemo } from 'react';
import './../assets/calendar.css';
import { Lunar } from 'lunar-javascript';

// 日期工具函数
const getMonthBoundaries = (year: number, month: number) => ({
  firstDay: new Date(year, month, 1),
  lastDay: new Date(year, month + 1, 0)
});

const isSameDate = (date1: Date, date2: Date) => (
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
);

// 日历单元格组件
interface CalendarCellProps {
  date: Date | null;
  isToday: boolean;
}

const CalendarCell: React.FC<CalendarCellProps> = ({ date, isToday }) => {
  if (!date) {
    return <div className="calendar-cell empty" />;
  }

  const lunar = Lunar.fromDate(date);
  const isWeekend = [0, 6].includes(date.getDay());

  return (
    <div className={`calendar-cell ${isWeekend ? 'weekend' : ''} ${isToday ? 'today' : ''}`}>
      <div className="solar-day">{date.getDate()}</div>
      <div className="lunar-day">{lunar.getDayInChinese()}</div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const now = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(now);
  const [today, setToday] = useState(now);

  // 每分钟更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 60_000);
    
    return () => clearInterval(timer);
  }, []);

  // 日期导航处理
  const navigate = (years = 0, months = 0) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(
        newDate.getFullYear() + years,
        newDate.getMonth() + months
      );
      return newDate;
    });
  };

  const goToToday = () => setCurrentDate(new Date());

  // 生成日历数据
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const { firstDay, lastDay } = getMonthBoundaries(year, month);
    const daysInMonth = lastDay.getDate();
    const firstDayOfWeek = firstDay.getDay();
    
    return Array.from({ length: 42 }, (_, i) => {
      if (i < firstDayOfWeek || i >= firstDayOfWeek + daysInMonth) {
        return null;
      }
      return new Date(year, month, i - firstDayOfWeek + 1);
    });
  }, [currentDate]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

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
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} className="weekday-header">{day}</div>
        ))}
        
        {calendarDays.map((date, index) => (
          <CalendarCell 
            key={index} 
            date={date} 
            isToday={date ? isSameDate(date, today) : false} 
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;