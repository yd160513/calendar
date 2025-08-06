// renderer/src/components/reminders/ReminderList.tsx
import React, { useState, useEffect } from 'react';
import { Button, List, Typography, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ReminderForm from './ReminderForm';
import ReminderItem from './ReminderItem';
import { Reminder } from '@renderer/types/reminders';

const { Title } = Typography;

const ReminderList: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // 检查提醒时间
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      reminders.forEach(reminder => {
        // 检查是否到达提醒时间且未完成
        if (!reminder.completed && new Date(reminder.date) <= now) {
          // 发送系统通知
          window.api.sendNotification('提醒事项', reminder.title);

          // 如果是重复提醒，则更新下次提醒时间
          if (reminder.repeat !== 'none') {
            const nextDate = new Date(reminder.date);
            switch (reminder.repeat) {
              case 'minutely':
                nextDate.setMinutes(nextDate.getMinutes() + 1);
                break;
              case 'halfHourly':
                nextDate.setMinutes(nextDate.getMinutes() + 30);
                break;
              case 'hourly':
                nextDate.setHours(nextDate.getHours() + 1);
                break;
              case 'daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            }

            setReminders(prev =>
              prev.map(r =>
                r.id === reminder.id ? { ...r, date: nextDate } : r
              )
            );
          } else {
            // 标记为已完成
            setReminders(prev =>
              prev.map(r =>
                r.id === reminder.id ? { ...r, completed: true } : r
              )
            );
          }

          message.info(`提醒: ${reminder.title}`);
        }
      });
    }, 1000); // 每秒检查

    return () => clearInterval(interval);
  }, [reminders]);

  const handleAddReminder = (reminder: Omit<Reminder, 'id' | 'completed'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: Date.now().toString(),
      completed: false
    };

    setReminders([...reminders, newReminder]);
    setIsModalVisible(false);
    message.success('提醒事项添加成功');
  };

  const handleDeleteReminder = (id: string) => {
    setReminders(reminders.filter(reminder => reminder.id !== id));
    message.success('提醒事项已删除');
  };

  const handleToggleComplete = (id: string) => {
    setReminders(
      reminders.map(reminder =>
        reminder.id === id
          ? { ...reminder, completed: !reminder.completed }
          : reminder
      )
    );
  };

  const handleEditReminder = (id: string, data: Omit<Reminder, 'id' | 'completed'>) => {
    setReminders(
      reminders.map(reminder =>
        reminder.id === id
          ? { ...reminder, ...data }
          : reminder
      )
    );
    message.success('提醒事项已更新');
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={4} style={{ margin: 0 }}>提醒事项</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
        >
          添加提醒
        </Button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <List
          dataSource={reminders}
          renderItem={reminder => (
            <ReminderItem
              key={reminder.id}
              reminder={reminder}
              onDelete={handleDeleteReminder}
              onToggleComplete={handleToggleComplete}
              onEdit={handleEditReminder}
            />
          )}
          locale={{ emptyText: '暂无提醒事项' }}
        />
      </div>

      <Modal
        title="添加提醒事项"
        centered={true}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <ReminderForm onSubmit={handleAddReminder} />
      </Modal>
    </div>
  );
};

export default ReminderList;
