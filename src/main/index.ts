// src/main/index.ts
import { app, shell, BrowserWindow, ipcMain, Notification } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

// 保存当前提醒窗口的引用
let reminderWindow: BrowserWindow | null = null
// 保存主窗口引用
let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: '万年历 - 您的私人日历',
    width: 900,
    height: 670,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow!.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // 监听主窗口关闭事件
  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// 创建久坐提醒窗口
const createReminderWindow = (content: string) => {
  // 如果已经存在提醒窗口，先关闭它
  if (reminderWindow) {
    reminderWindow.destroy()
  }

  reminderWindow = new BrowserWindow({
    width: 300,
    height: 180,
    show: true,
    resizable: false,
    autoHideMenuBar: true,
    frame: false,
    alwaysOnTop: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  // 加载提醒窗口页面
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    reminderWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/reminder.html`)
  } else {
    reminderWindow.loadFile(join(__dirname, '../renderer/reminder.html'))
  }

  reminderWindow.webContents.on('did-finish-load', () => {
    reminderWindow!.webContents.send('set-reminder-content', content)
  })

  // 监听窗口关闭事件
  reminderWindow.on('closed', () => {
    reminderWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // 监听久坐提醒
  ipcMain.on('sedentary-reminder', (_, { content }) => {
    console.log('sedentary-reminder', content)
    createReminderWindow(content)
  })

  // 监听重启提醒请求
  ipcMain.on('restart-reminder', () => {
    console.log('restart-reminder')
    // 关闭当前提醒窗口
    if (reminderWindow) {
      reminderWindow.destroy()
      reminderWindow = null
    }

    // 通知主窗口重新开始计时
    if (mainWindow) {
      mainWindow.webContents.send('restart-sedentary-timer')
    }
  })

  // 监听关闭提醒请求
  ipcMain.on('dismiss-reminder', () => {
    console.log('dismiss-reminder')
    // 关闭当前提醒窗口
    if (reminderWindow) {
      reminderWindow.destroy()
      reminderWindow = null
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
