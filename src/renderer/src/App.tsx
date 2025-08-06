// renderer/src/App.tsx
import React from 'react'
import { Layout } from 'antd'
import Calendar from './components/calendar/Calendar'
import ReminderList from './components/reminders/ReminderList'

const { Content } = Layout

const App: React.FC = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ display: 'flex', padding: '20px' }}>
        <div style={{ paddingRight: '20px' }}>
          <div>
            <Calendar />
          </div>
        </div>

        <div style={{ flex: 1, borderLeft: '1px solid #f0f0f0', paddingLeft: '20px' }}>
          <ReminderList />
        </div>
      </Content>
    </Layout>
  )
}

export default App
