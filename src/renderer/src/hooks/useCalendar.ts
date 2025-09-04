import { useState, useMemo, useEffect } from 'react'
import { getMonthBoundaries } from '../utils/date';

/**
 * 日历逻辑 hook
 * @param weekStartMonday 是否以周一为一周的开始
 * @returns 日历相关状态和方法
 */
export const useCalendar = (weekStartMonday: boolean = false) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [today, setToday] = useState(new Date());
  const [userNavigated, setUserNavigated] = useState(false); // 标记用户是否手动切换过月份
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 定期更新 today 状态
  useEffect(() => {
    const timer = setInterval(() => {
      const newToday = new Date();
      setToday(prevToday => {
        // 检查是否跨天了
        if (prevToday.getDate() !== newToday.getDate() ||
          prevToday.getMonth() !== newToday.getMonth() ||
          prevToday.getFullYear() !== newToday.getFullYear()) {
          return newToday;
        }
        return prevToday;
      });

      // 只有当用户没有手动切换月份时，才自动更新到当前月份
      setCurrentDate(prevCurrentDate => {
        // 检查 currentDate 和实际日期是否在同一月份
        if (!userNavigated &&
            (prevCurrentDate.getMonth() !== newToday.getMonth() ||
             prevCurrentDate.getFullYear() !== newToday.getFullYear())) {
          // 如果不是，则更新为当前月份
          return newToday;
        }
        return prevCurrentDate;
      });
    }, 60000); // 每分钟检查一次

    return () => clearInterval(timer);
  }, [userNavigated]); // 添加 userNavigated 作为依赖项

  const weekdayHeaders = useMemo(() => {
    const base = ['日', '一', '二', '三', '四', '五', '六'];
    return weekStartMonday ? [...base.slice(1), base[0]] : base;
  }, [weekStartMonday]);

  // 日期导航处理
  const navigate = (years: number = 0, months: number = 0) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(
        newDate.getFullYear() + years,
        newDate.getMonth() + months
      );
      return newDate;
    });
    // 用户手动切换月份时，设置标记
    setUserNavigated(true);
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setToday(now);
    // 回到今天时，清除用户手动切换标记
    setUserNavigated(false);
  };

  // 生成日历数据
  const calendarDays = useMemo(() => {
    // 获取当前展示的年月
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    // 计算当月边界
    const { firstDay } = getMonthBoundaries(year, month);
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
  }, [currentDate, weekStartMonday]);

  return {
    currentDate,
    today,
    currentYear,
    currentMonth,
    weekdayHeaders,
    calendarDays,
    navigate,
    goToToday,
    setToday
  };
};
