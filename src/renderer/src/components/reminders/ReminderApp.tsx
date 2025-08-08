// src/renderer/src/components/reminders/ReminderApp.tsx
import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import dayjs from 'dayjs';
import '../../assets/ReminderPopup.css'; // 引入样式文件

const ReminderApp: React.FC = () => {
  const [reminderContent, setReminderContent] = useState('');
  const [reminderTime, setReminderTime] = useState('');

  useEffect(() => {
    window.api.onSetReminderContent((content) => {
      setReminderContent(content);
      setReminderTime(dayjs().format('HH:mm:ss')); // 设置当前时间
    });
  }, []);

  useEffect(() => {
    // 从主进程获取提醒内容
    const getReminderContent = async () => {
      try {
        const content = await window.api?.getReminderContent();
        if (content) {
          setReminderContent(content);
          setReminderTime(dayjs().format('HH:mm:ss')); // 设置当前时间
        }
      } catch (error) {
        console.error('Failed to get reminder content:', error);
      }
    };

    getReminderContent();
  }, []);

  const handleDismiss = () => {
    window.api?.dismissReminder();
  };

  const handleRestart = () => {
    window.api?.restartReminder();
  };

  return (
    <div className="reminder-popup">
      <div className="reminder-content">
        <div className="reminder-time-section">
          <h3>提醒时间</h3>
          <p>{reminderTime}</p>
        </div>
        <div className="reminder-message-section">
          <h3>提醒内容</h3>
          <p>{reminderContent}</p>
        </div>
      </div>
      <div className="reminder-actions">
        <Button onClick={handleDismiss}>
          关闭
        </Button>
        <Button type="primary" onClick={handleRestart}>
          再次开始
        </Button>
      </div>
    </div>
  );
};

export default ReminderApp;
