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
  // 获取节日（农历）
  const lunarFestivals = lunar.getFestivals(); // 使用 getFestivals() 替代 getDayFestivals()
  // 获取节日（公历）
  const solarFestivals = lunar.getSolar().getFestivals();
  // 合并节日列表，农历节日优先
  const festivals = [...lunarFestivals, ...solarFestivals];
  // 获取第一个节日名称（如果有）
  const festivalName = festivals.length > 0 ? festivals[0] : '';

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

  // 判断是否有节日
  const hasFestival = festivals.length > 0;
  // 判断是否有节气
  const hasSolarTerm = !!solarTerm;
  // 判断是否为农历月份的第一天
  const isFirstDayOfLunarMonth = lunar.getDay() === 1;

  // 确定要显示的农历内容
  const lunarDisplay = festivalName || solarTerm || (isFirstDayOfLunarMonth ? `${lunar.getMonthInChinese()}月` : lunar.getDayInChinese());

  return (
    <div className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isWeekend && isHoliday && !isWorkup ? 'holiday' : isWeekend && !isWorkup ? 'weekend' : isHoliday && !isWorkup ? 'holiday' : isWorkup ? 'work-up' : ''} ${isToday ? 'today' : ''} ${hasFestival ? 'festival-day' : ''} ${hasSolarTerm ? 'solar-term-day' : ''} ${isFirstDayOfLunarMonth && !festivalName && !solarTerm ? 'lunar-first-day' : ''}`}>
      {render()}
      <div className="solar-day">{date.getDate()}</div>
      <div className="lunar-day" title={festivalName || solarTerm || (isFirstDayOfLunarMonth ? lunar.getMonthInChinese() : lunar.getDayInChinese())}>
        {lunarDisplay}
      </div>
    </div>
  );
};

export default CalendarCell;
