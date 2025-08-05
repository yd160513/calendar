export interface CalendarProps {
  weekStartMonday?: boolean; // 是否以周一为一周的第一天
}

export interface CalendarCellProps {
  date: Date;
  isToday: boolean;
  currentMonth: number; // 当前月份
}
