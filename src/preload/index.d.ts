import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendSedentaryReminder: (content: string) => void
      onSetReminderContent: (callback: (content: string) => void) => void
      restartReminder: () => void
      dismissReminder: () => void
      onRestartSedentaryTimer: (callback: () => void) => void
    }
  }
}
