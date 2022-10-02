import { app, ipcMain, Menu, shell } from 'electron'
import AppMenu from './menu'
import { Redy, WebContentsCreated, WinAllClose } from './events'
import {
  IPC_CHECK_ROOT,
  IPC_SAVE_DATA,
  IPC_SET_ROOT_PWD,
  IPC_GET_LIST_REQ,
  IPC_GET_TAG_LIST_REQ,
  IPC_DELETE_DATA,
  IPC_EDIT_DATA,
  IPC_RESET_ROOT_PWD,
  IPC_RESET_CHECK_ROOT_PWD,
} from './ipcs'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 绑定应用菜单
let menuBuilder = Menu.buildFromTemplate(AppMenu)
Menu.setApplicationMenu(menuBuilder)

// Object.defineProperty(app, 'isPackaged', {
//   get() {
//     return true;
//   }
// });

app.whenReady().then(Redy)
app.on('window-all-closed', WinAllClose)
// 拦截渲染进程里面的所有新开窗口事件，用默认浏览器打开
app.on('web-contents-created', WebContentsCreated)

ipcMain.on('ipc_check_root', IPC_CHECK_ROOT)
ipcMain.on('ipc_set_root_pwd', IPC_SET_ROOT_PWD)
ipcMain.on('ipc_save_data', IPC_SAVE_DATA)
ipcMain.on('ipc_get_list_req', IPC_GET_LIST_REQ)
ipcMain.on('ipc_get_tag_list_req', IPC_GET_TAG_LIST_REQ)
ipcMain.on('ipc_delete_data', IPC_DELETE_DATA)
ipcMain.on('ipc_edit_data', IPC_EDIT_DATA)
ipcMain.on('ipc_reset_check_root_pwd', IPC_RESET_CHECK_ROOT_PWD)
ipcMain.on('ipc_reset_root_pwd', IPC_RESET_ROOT_PWD)
