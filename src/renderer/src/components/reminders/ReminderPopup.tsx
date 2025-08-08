// renderer/src/components/reminders/ReminderPopup.tsx
import React from 'react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import './../../assets/ReminderPopup.css';

interface ReminderPopupProps {
  content: string;
  onRestart: () => void;
}

const ReminderPopup: React.FC<ReminderPopupProps> = ({ content, onRestart }) => {
  const reminderTime = dayjs().format('HH:mm:ss');

  return (
    <div className="reminder-popup">
      <div className="reminder-content">
        <div className="reminder-time-section">
          <h3>提醒时间</h3>
          <p>{reminderTime}</p>
        </div>
        <div className="reminder-message-section">
          <h3>提醒内容</h3>
          <p>{content}</p>
        </div>
      </div>
      <div className="reminder-actions">
        <Button type="primary" onClick={onRestart}>
          再次开始
        </Button>
      </div>
    </div>
  );
};

export default ReminderPopup;
