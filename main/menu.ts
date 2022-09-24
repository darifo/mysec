// ================== 存放 APP 的菜单及处理逻辑  ===================== //

import { BrowserWindow } from "electron";

const AppMenu = [
    {
        label: '文件',
        submenu: [
            {
                label: '关于程序',
                click: () => {
                    console.log('关于程序');
                    const win = BrowserWindow.getFocusedWindow()
                    if (win) {
                        win.webContents.send('ipc_menu_click', "ABOUT_ME");
                    }
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
                    console.log('锁定工具');
                },
            },
        ],
    },
];

export default AppMenu;