import React, { useState, useEffect } from 'react'
import './../assets/calendar.css'
import { Lunar } from 'lunar-javascript'

const Calendar: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear())
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth())
  const [today, setToday] = useState<Date>(new Date())

  // 初始化时设置当前日期
  useEffect(() => {
    const timer = setInterval(() => {
      setToday(new Date())
    }, 60 * 1000) // 每分钟更新一次

    return () => clearInterval(timer)
  }, [])

  // 处理年份变化
  const handlePrevYear = () => setCurrentYear((prev) => prev - 1)
  const handleNextYear = () => setCurrentYear((prev) => prev + 1)
  const handleToday = () => {
    setCurrentYear(today.getFullYear())
    setCurrentMonth(today.getMonth()) // 新增月份状态更新
  }
  // 新增月份处理函数
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1)
        return 11
      }
      return prev - 1
    })
  }

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1)
        return 0
      }
      return prev + 1
    })
  }

  // 检查是否是今天
  const isToday = (date: Date): boolean => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  // 检查是否是周末
  const isWeekend = (date: Date): boolean => {
    const day = date.getDay()
    return day === 0 || day === 6
  }

  // 获取农历显示文本
  const getLunarText = (date: Date): string => {
    const lunar = Lunar.fromDate(date)

    return lunar.getDayInChinese()
  }

  // 当前月份
  // const month = new Date().getMonth()
  const firstDay = new Date(currentYear, currentMonth, 1)
  const lastDay = new Date(currentYear, currentMonth + 1, 0)
  // 获取当月第一天是周几（0=周日, 1=周一, ...）
  const firstDayOfWeek = firstDay.getDay()
  // 计算当月天数
  const daysInMonth = lastDay.getDate()
  // 生成日历格子
  const days = []
  // 添加前面的空白
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null)
  }
  // 添加当月日期
  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(currentYear, currentMonth, i)
    days.push(date)
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={handlePrevYear} className="nav-button">
          上一年
        </button>
        <h2 className="current-year">{currentYear}年</h2>
        <button onClick={handleNextYear} className="nav-button">
          下一年
        </button>
        <button onClick={handleToday} className="today-button">
          回到今天
        </button>
      </div>
      <div className="month-container">
        <button onClick={handlePrevMonth} className="nav-button">
          上个月
        </button>
        <h3 className="month-title">{currentMonth + 1}月</h3>
        <button onClick={handleNextMonth} className="nav-button">
          下个月
        </button>
        <div className="calendar-grid">
          {['日', '一', '二', '三', '四', '五', '六'].map((day, index) => (
            <div key={index} className="calendar-header">
              {day}
            </div>
          ))}
          {days.map((date, index) => {
            if (date === null) {
              return <div key={index} className="calendar-cell empty"></div>
            }

            const day = date.getDate()
            const isWeekendDay = isWeekend(date)
            const isTodayDate = isToday(date)
            const lunarText = getLunarText(date)

            return (
              <div
                key={index}
                className={`calendar-cell ${isWeekendDay ? 'weekend' : ''} ${isTodayDate ? 'today' : ''}`}
              >
                <div className="solar-day">{day}</div>
                <div className="lunar-day">{lunarText}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Calendar
