// src/preload/index.ts
import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  // 发送系统通知
  sendSedentaryReminder: (content: string) => {
    console.log('preload-----1111', content)
    ipcRenderer.send('sedentary-reminder', { content })
  },
  onSetReminderContent: (cb) => {
    ipcRenderer.on('set-reminder-content', (_, content) => {
      cb(content)
    })
  },
  // 重启提醒
  restartReminder: () => {
    ipcRenderer.send('restart-reminder')
  },
  // 关闭提醒
  dismissReminder: () => {
    ipcRenderer.send('dismiss-reminder')
  },
  // 监听重启久坐计时器消息
  onRestartSedentaryTimer: (cb) => {
    ipcRenderer.on('restart-sedentary-timer', () => {
      cb()
    })
  },
  // 关闭提醒弹窗
  closeSedentaryReminder: () => ipcRenderer.send('close-sedentary-reminder'),
}

// Use [contextBridge](file:///Users/dong/Documents/project/calendar/node_modules/electron/electron.d.ts#L24729-L24729) APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
