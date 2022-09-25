import { app, ipcMain, Menu, shell } from 'electron'
import AppMenu from './menu'
import { Redy, WebContentsCreated, WinAllClose } from './events'
import { IPC_SEL_DATA, IPC_SET_ROOT_PWD } from './ipcs'
import { encryptByAES, decryptedByAES, AES_KEY, AES_IV } from './crypt'

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

// 绑定应用菜单
let menuBuilder = Menu.buildFromTemplate(AppMenu)
Menu.setApplicationMenu(menuBuilder)

app.whenReady().then(Redy)
app.on('window-all-closed', WinAllClose)
// 拦截渲染进程里面的所有新开窗口事件，用默认浏览器打开
app.on('web-contents-created', WebContentsCreated)

ipcMain.on('ipc_sel_data', IPC_SEL_DATA)
ipcMain.on('ipc_set_root_pwd', IPC_SET_ROOT_PWD)

let de = encryptByAES('darifo', AES_KEY, AES_IV)
console.log(de)
console.log(decryptedByAES(de, AES_KEY, AES_IV))
