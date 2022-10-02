import { BrowserWindow, dialog } from 'electron'

const { autoUpdater } = require('electron-updater')

autoUpdater.autoDownload = false // 关闭自动更新
autoUpdater.autoInstallOnAppQuit = true // APP退出的时候自动安装

// 发送消息给渲染进程
function sendStatusToWindow(status: string, info: any) {
  const win = BrowserWindow.getFocusedWindow()
  if (win) {
    win.webContents.send('ipc_updater', { status: status, info: info })
  }
}
// 更新检查
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('checking', '检查更新中...')
})
// 可以更新版本
autoUpdater.on('update-available', (info: string) => {
  sendStatusToWindow('canUpdate', info)
  dialog
    .showMessageBox({
      type: 'info',
      title: '软件更新',
      message: '发现新版本, 确定更新?',
      buttons: ['确定', '取消'],
    })
    .then((resp) => {
      if (resp.response == 0) {
        autoUpdater.downloadUpdate()
      }
    })
})
// 不能够更新
autoUpdater.on('update-not-available', (info: any) => {
  sendStatusToWindow('noUpdate', info)
  dialog.showMessageBox({
    title: '提示',
    message: '暂无更新！',
  })
})
// 更新错误
autoUpdater.on('error', (err: any) => {
  sendStatusToWindow('updateError ', err)
  dialog.showMessageBox({
    title: '更新失败',
    message: err.message,
  })
})
// 正在下载的下载进度
autoUpdater.on('download-progress', (progressObj: any) => {
  sendStatusToWindow('progress', progressObj)
})
// 下载完成
autoUpdater.on('update-downloaded', (info: any) => {
  sendStatusToWindow('downloaded', info)
  dialog
    .showMessageBox({
      title: '下载完成',
      message: '最新版本已下载完成, 退出程序进行安装',
    })
    .then(() => {
      autoUpdater.quitAndInstall()
    })
})

export default autoUpdater
