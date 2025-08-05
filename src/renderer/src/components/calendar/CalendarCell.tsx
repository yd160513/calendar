// components/calendar/CalendarCell.tsx
import React from 'react';
import { Lunar, HolidayUtil } from 'lunar-typescript';
import { CalendarCellProps } from '../../types/calendar';
import '../../assets/calendar.css';

const CalendarCell: React.FC<CalendarCellProps> = ({ date, isToday, currentMonth }) => {
  const isCurrentMonth = date.getMonth() === currentMonth;

  const lunar = Lunar.fromDate(date);
  // 周末
  const isWeekend = [0, 6].includes(date.getDay());
  // 节假日
  const isHoliday = HolidayUtil.getHoliday(date.getFullYear(), date.getMonth() + 1, date.getDate());
  // 补班
  const isWorkup = isHoliday?.isWork();
  // 节气
  const solarTerm = lunar.getJieQi();

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
  };

  return (
    <div className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isWeekend && isHoliday && !isWorkup ? 'holiday' : isWeekend && !isWorkup ? 'weekend' : isHoliday && !isWorkup ? 'holiday' : isWorkup ? 'work-up' : ''} ${isToday ? 'today' : ''}`}>
      {render()}
      <div className="solar-day">{date.getDate()}</div>
      <div className="lunar-day">{solarTerm || lunar.getDayInChinese()}</div>
    </div>
  );
};

export default CalendarCell;
