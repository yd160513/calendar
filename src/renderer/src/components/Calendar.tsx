import React, { useState, useEffect, useMemo } from 'react';
import './../assets/calendar.css';
import { Lunar, HolidayUtil } from 'lunar-typescript';

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
  // 周末
  const isWeekend = [0, 6].includes(date.getDay());
  // 节假日
  const isHoliday = HolidayUtil.getHoliday(date.getFullYear(), date.getMonth() + 1, date.getDate());
  console.log(isHoliday)
  // 补班
  const isWorkup = isHoliday?.isWork();

  const render = () => {
    // 既是周末又是节假日且不调休
    if (isWeekend && isHoliday && !isWorkup) {
      return <div className="day-tip">休</div>;
    }
    // 周末且不调休
    else if (isWeekend && !isWorkup) {
      return <div className="day-tip">末</div>;
    }
    // 节假日且不调休
    else if (isHoliday && !isWorkup) {
      return <div className="day-tip">休</div>;
    }
    // 补班
    else if (isWorkup) {
      return <div className="day-tip">班</div>;
    } else {
      return <div className="day-tip"></div>;
    }
  }

  return (
    <div className={`calendar-cell ${isWeekend && isHoliday && !isWorkup ? 'holiday' : isWeekend && !isWorkup ? 'weekend' : isHoliday && !isWorkup ? 'holiday' : isWorkup ? 'work-up' : ''} ${isToday ? 'today' : ''}`}>
      {render()}
      <div className="solar-day">{date.getDate()}</div>
      <div className="lunar-day">{lunar.getDayInChinese()}</div>
    </div>
  );
};

const Calendar: React.FC = () => {
  const now = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(now);
  const [today, setToday] = useState(now);

  console.log('HolidayUtil.getHoliday(): ', HolidayUtil.getHoliday(2025, 4, 27)?.isWork())

  // 检查周六日是否补班


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
