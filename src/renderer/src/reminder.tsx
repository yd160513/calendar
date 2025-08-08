// src/renderer/src/reminder.tsx
import './assets/reminder.css'
import './assets/ReminderPopup.css' // 添加这一行

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReminderApp from './components/reminders/ReminderApp'

createRoot(document.getElementById('reminder-root')!).render(
  <StrictMode>
    <ReminderApp />
  </StrictMode>
)
