import { app, BrowserWindow, globalShortcut, shell } from 'electron'
import { createWindow } from './window'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
// import autoUpdater from './updater'

export const Redy = async () => {
  // 注册全局快捷键
  // globalShortcut.register('Alt+M', function () {
  //   console.log("Alt+M");
  // })
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  if (!app.isPackaged) {
    await installExtension(VUEJS_DEVTOOLS)
  }
  // // 每次运行APP检测更新。这里设置延时是为了避免还未开始渲染，更新检测就已经完成(网速超快，页面加载跟不上)。
  // setTimeout(() => {
  //   // 检测是否有更新
  //   autoUpdater.checkForUpdatesAndNotify()
  // }, 10000)
}

export const WinAllClose = () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

export const WebContentsCreated = (e: any, webContents: any) => {
  // 处理 window.open 跳转
  webContents.setWindowOpenHandler((data: any) => {
    shell.openExternal(data.url)
    return {
      action: 'deny',
    }
  })
}
