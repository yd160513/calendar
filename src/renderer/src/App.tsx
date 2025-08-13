import React, { useState, useRef } from 'react';
import { Layout } from 'antd';
import Calendar from './components/calendar/Calendar';
import SedentaryReminder from './components/reminders/SedentaryReminder';

const { Content } = Layout;

const App: React.FC = () => {
  const sedentaryReminderRef = useRef<{ handleRestartReminder: () => void } | null>(null);

  const handleReminderTrigger = (content: string) => {
    window.api?.sendSedentaryReminder?.(content);
  };

  const handleRestartReminder = () => {
    // 调用子组件的 handleRestartReminder 方法
    if (sedentaryReminderRef.current) {
      sedentaryReminderRef.current.handleRestartReminder();
    }
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ display: 'flex', padding: '20px' }}>
        <div style={{ paddingRight: '20px' }}>
          <div>
            <Calendar />
          </div>
        </div>

        <div style={{
          flex: 1,
          borderLeft: '1px solid #f0f0f0',
          paddingLeft: '20px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <SedentaryReminder
              ref={sedentaryReminderRef}
              onReminderTrigger={handleReminderTrigger}
            />
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default App;
