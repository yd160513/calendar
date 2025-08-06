export interface ReminderFormData {
  title: string;
  content?: string;
  date: Date;
  repeat: 'none' | 'minutely' | 'halfHourly' | 'hourly' | 'daily';
  hasTime: boolean;
}

export interface Reminder extends Omit<ReminderFormData, 'hasTime'> {
  id: string;
  completed: boolean;
}
