
import { app, BrowserWindow } from 'electron'
import path from 'path'
import { dbUser, dbPathUser, dbPathData } from './repo'

export const createWindow = async () => {
  const win = new BrowserWindow({
    height: 600,
    width: 800,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  if (app.isPackaged) {
    await win.loadFile(path.join(__dirname, '../index.html'))
  } else {
    const url = `http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SERVER_PORT']}`
    await win.loadURL(url)
    win.webContents.openDevTools()
  }

  // 窗口尺寸改变事件
  win.on('resized', () => {
    const docHeight = win.getSize()[1] - 50
    const docWidth = win.getSize()[0]
    console.log(docHeight, docWidth)
    win.webContents.send('ipc_win_resize', {
      height: docHeight,
      width: docWidth,
    })
  })
  // 窗口显示的时候给渲染进程发送初始窗口尺寸
  const docHeight = win.getSize()[1] - 50
  const docWidth = win.getSize()[0]
  console.log(docHeight, docWidth)
  win.webContents.send('ipc_win_resize', { height: docHeight, width: docWidth })

  // 程序运行目录 查询是否已经设置好root密码
  let account = null
  const check = new Promise((resolve) => {
    dbUser.findOne({ account: 'root' }, function (err: string, doc: any) {
      resolve(doc)
    })
  })
  await check.then((val: any) => {
    // console.log(val)
    account = val ? val.account : null
  })

  win.webContents.send('ipc_recive_app_info', {
    app_name: app.getName(),
    app_version: app.getVersion(),
    app_path: app.getAppPath(),
    db_user_path: dbPathUser,
    db_data_path: dbPathData,
    is_init_root: account == null ? false : true,
  })
}