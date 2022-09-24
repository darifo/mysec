import { app, BrowserWindow, Menu } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';

import path from 'path';

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// 绑定应用菜单
let menuBuilder = null;
Menu.setApplicationMenu(menuBuilder);

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, '../index.html'));
    } else {
        //  Use ['ENV_NAME'] avoid vite:define plugin
        const url = `http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SERVER_PORT']}`;
        win.loadURL(url);
    }
    win.webContents.openDevTools()
};
app.whenReady().then(async () => {
    createWindow();
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    await installExtension(VUEJS_DEVTOOLS);
});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});