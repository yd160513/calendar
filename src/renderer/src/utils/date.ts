/**
 * 获取月份的边界日期
 * @param year 年份
 * @param month 月份 (0-11)
 * @returns 包含该月第一天和最后一天的对象
 */
export const getMonthBoundaries = (year: number, month: number) => ({
  firstDay: new Date(year, month, 1),
  lastDay: new Date(year, month + 1, 0)
});

/**
 * 判断两个日期是否为同一天
 * @param date1 日期1
 * @param date2 日期2
 * @returns 是否为同一天
 */
export const isSameDate = (date1: Date, date2: Date): boolean => (
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate()
);
