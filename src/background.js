'use strict';

import { app, shell, protocol, BrowserWindow, Menu, ipcMain } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import AppMenu from './menu';

const isDevelopment = process.env.NODE_ENV !== 'production';

console.log(
  process.env.NODE_ENV
);

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

// 固定写法
let menuBuilder = Menu.buildFromTemplate(AppMenu);
Menu.setApplicationMenu(menuBuilder);

let win;

async function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 900,
    height: 600,
    minHeight: 600,
    minWidth: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (isDevelopment) win.webContents.openDevTools();
  } else {
    createProtocol('app');
    // Load the index.html when not in development
    win.loadURL('app://./index.html');
  }
  // win.maximize();
  // 窗口尺寸改变事件
  win.on('resize', () => {
    const docHeight = win.getSize()[1] - 230;
    const docWidth = win.getSize()[0];
    win.webContents.send("ipc_win_resize", { height: docHeight, width: docWidth });
  });
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  console.log("ready");
  if (isDevelopment) {
    // Install Vue Devtools
    try {
      console.log("installExtension");
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString());
    }
  }
  createWindow();
});

// 拦截渲染进程里面的所有新开窗口事件，用默认浏览器打开
app.on('web-contents-created', (e, webContents) => {
  webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
});


// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}

ipcMain.on("ipc_win_init_size", (e, data) => {
  console.log("ipc_win_init_size:", data);
  const docHeight = win.getSize()[1] - 200;
  const docWidth = win.getSize()[0];
  e.sender.send("ipc_win_resize", { height: docHeight, width: docWidth });
});
