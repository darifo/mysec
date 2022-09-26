// ================== 存放 APP 的菜单及处理逻辑  ===================== //

import { app, BrowserWindow } from 'electron'

const AppMenu = [
  {
    label: '文件',
    submenu: [
      {
        label: '退出程序',
        click: () => {
          console.log('退出程序')
          app.quit()
        },
      },
    ],
  },
  {
    label: '操作',
    submenu: [
      {
        label: '锁定工具',
        accelerator: 'ctrl+l',
        click: () => {
          console.log('锁定工具')
          const win = BrowserWindow.getFocusedWindow()
          if (win) {
            win.webContents.send('ipc_menu_click', 'CLOCK_PAGE')
          }
        },
      },
      {
        label: '修改主密码',
        click: () => {
          console.log('修改主密码')
          const win = BrowserWindow.getFocusedWindow()
          if (win) {
            win.webContents.send('ipc_menu_click', 'RESET_ROOT_PWD')
          }
        },
      },
    ],
  },
  {
    label: '其他',
    submenu: [
      {
        label: '联系作者',
        click: () => {
          console.log('联系作者')
          const win = BrowserWindow.getFocusedWindow()
          if (win) {
            win.webContents.send('ipc_menu_click', 'CALL_AUTHOR')
          }
        },
      },
      {
        label: '贡献代码',
        click: () => {
          console.log('贡献代码')
          const win = BrowserWindow.getFocusedWindow()
          if (win) {
            win.webContents.send('ipc_menu_click', 'COMMIT_CODE')
          }
        },
      },
      {
        label: '关于程序',
        click: () => {
          console.log('关于程序')
          const win = BrowserWindow.getFocusedWindow()
          if (win) {
            win.webContents.send('ipc_menu_click', 'ABOUT_ME')
          }
        },
      },
    ],
  },
]

export default AppMenu
