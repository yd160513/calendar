import React from 'react'
import { Layout } from 'antd'
import Calendar from './components/calendar/Calendar'
import SedentaryReminder from './components/reminders/SedentaryReminder'

const { Content } = Layout

const VERSION = `${__APP_VERSION__} (${__COMMIT_ID__})`

const App: React.FC = () => {
  return (
    <Layout style={{ height: '100vh' }}>
      <Content style={{ display: 'flex', padding: '20px' }}>
        <div style={{ paddingRight: '20px' }}>
          <div>
            <Calendar />
          </div>
        </div>

        <div
          style={{
            flex: 1,
            borderLeft: '1px solid #f0f0f0',
            paddingLeft: '20px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <div style={{ marginBottom: '16px' }}>
            <SedentaryReminder />
          </div>
        </div>
      </Content>

      <div
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          fontSize: '12px',
          color: '#999',
          zIndex: 1000
        }}
      >
        v{VERSION}
      </div>
    </Layout>
  )
}

export default App
