import { app, BrowserWindow,shell } from 'electron'
import { createWindow } from './window'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'

export const Redy = async () => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  if (!app.isPackaged) {
    await installExtension(VUEJS_DEVTOOLS)
  }
}

export const WinAllClose = () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
}

export const WebContentsCreated = (e: any, webContents: any) => {
  webContents.on('new-window', (event: any, url: string) => {
    event.preventDefault()
    shell.openExternal(url)
  })
}
