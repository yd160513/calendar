import React, { useState, useEffect, useMemo } from 'react';
import './../assets/calendar.css';
import { Lunar, HolidayUtil } from 'lunar-typescript';

// 日期工具函数
const getMonthBoundaries = (year: number, month: number) => ({
  firstDay: new Date(year, month, 1), // month 月(0代表1月)，第三个参数 1 表示 month 的第一天
  lastDay: new Date(year, month + 1, 0) // month + 1 表示下个月的第一天，第三个参数为 0 表示上个月的最后一天，即当前月的最后一天
});

const isSameDate = (date1: Date, date2: Date) => (
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
);

interface CalendarProps {
  weekStartMonday?: boolean; // 是否以周一为一周的第一天
}

// 日历单元格组件
interface CalendarCellProps {
  date: Date;
  isToday: boolean;
  currentMonth: number; // 当前月份
}

const CalendarCell: React.FC<CalendarCellProps> = ({ date, isToday, currentMonth }) => {
  const isCurrentMonth = date.getMonth() === currentMonth;

  const lunar = Lunar.fromDate(date);
  // 周末
  const isWeekend = [0, 6].includes(date.getDay());
  // 节假日
  const isHoliday = HolidayUtil.getHoliday(date.getFullYear(), date.getMonth() + 1, date.getDate());
  console.log(isHoliday)
  // 补班
  const isWorkup = isHoliday?.isWork();
  // 节气
  const solarTerm = lunar.getJieQi()

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
    <div className={`calendar-cell ${!isCurrentMonth ? 'other-month' : ''} ${isWeekend && isHoliday && !isWorkup ? 'holiday' : isWeekend && !isWorkup ? 'weekend' : isHoliday && !isWorkup ? 'holiday' : isWorkup ? 'work-up' : ''} ${isToday ? 'today' : ''}`}>
      {render()}
      <div className="solar-day">{date.getDate()}</div>
      <div className="lunar-day">{solarTerm || lunar.getDayInChinese()}</div>
    </div>
  );
};

const Calendar: React.FC<CalendarProps> = ({ weekStartMonday = false }) => {
  const now = useMemo(() => new Date(), []);
  const [currentDate, setCurrentDate] = useState(now);
  const [today, setToday] = useState(now);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 每分钟更新时间
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date());
    }, 60_000);

    return () => clearInterval(timer);
  }, []);

  const weekdayHeaders = useMemo(() => {
    const base = ['日', '一', '二', '三', '四', '五', '六'];
    return weekStartMonday ? [...base.slice(1), base[0]] : base;
  }, [weekStartMonday]);

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
    // 获取当前展示的年月
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // 计算当月边界
    const { firstDay } = getMonthBoundaries(year, month);
    // 当月有多少天
    // const daysInMonth = lastDay.getDate();
    // 当月第一天是星期几
    let firstDayOfWeek = firstDay.getDay();

    // 如果以周一为一周的第一天，调整第一天的位置
    if (weekStartMonday) {
      // 将周日(0)转换为6，其他减1，使周一变为0
      firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    }

    // 创建包含完整6周的日期数组（42天）
    const startDate = new Date(year, month, 1 - firstDayOfWeek);

    /**
     * 生成42个单元格（6周）:
     * 问: 为什么需要 42 个单元格？
     * 答: 1. 行业通用做法，覆盖最长月份场景，31 天的月份 + 首日周六 = 需要 6 行（42 格）。示例：2023年12月（31天，首日周五）
     *     2. 固定 6 行可避免月份切换时的布局跳动。
     */
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      return date;
    });
    // return Array.from({ length: 42 }, (_, i) => {
    //   // 计算日期偏移量
    //   const dayOffset = i - (weekStartMonday ? firstDayOfWeek : firstDayOfWeek);
    //
    //   /**
    //    * 过滤非当月日期:
    //    *  1. 如果 i 小于 firstDayOfWeek，说明是上个月的日期
    //    *  2. 如果 i 大于等于 firstDayOfWeek + daysInMonth，说明是下个月的日期
    //    */
    //   if (i < firstDayOfWeek || i >= firstDayOfWeek + daysInMonth) {
    //     return null;
    //   }
    //
    //   // 生成具体日期对象
    //   return new Date(year, month, dayOffset + 1);
    // });
  }, [currentDate, weekStartMonday]);

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
            currentMonth={currentMonth} // 传递当前月份
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
