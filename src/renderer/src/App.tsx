// renderer/src/App.tsx
import React, { useState, useRef } from 'react';
import { Layout, Modal } from 'antd';
import Calendar from './components/calendar/Calendar';
import SedentaryReminder from './components/reminders/SedentaryReminder';
import ReminderPopup from './components/reminders/ReminderPopup';

const { Content } = Layout;

const App: React.FC = () => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');
  const sedentaryReminderRef = useRef<{ handleRestartReminder: () => void } | null>(null);

  const handleReminderTrigger = (content: string) => {
    setPopupContent(content);
    setIsPopupVisible(true);

    // 发送系统通知
    window.api?.sendSedentaryReminder?.(content);
  };

  const handleRestartReminder = () => {
    // 调用子组件的 handleRestartReminder 方法
    if (sedentaryReminderRef.current) {
      sedentaryReminderRef.current.handleRestartReminder();
    }
    setIsPopupVisible(false);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
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

      <Modal
        open={isPopupVisible}
        footer={null}
        closable={false}
        width={350}
        style={{ top: 20, right: 0, position: 'absolute', margin: 0 }}
      >
        <ReminderPopup
          content={popupContent}
          onRestart={handleRestartReminder}
          onClose={handleClosePopup}
        />
      </Modal>
    </Layout>
  );
};

export default App;
