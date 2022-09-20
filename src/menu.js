import { BrowserWindow } from "electron";

const AppMenu = [
  {
    label: '文件',
    submenu: [
      {
        label: '关于程序',
        click: () => {
          console.log('关于程序');
          BrowserWindow.getFocusedWindow().webContents.send('ipc_menu_click', "ABOUT_ME");
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
