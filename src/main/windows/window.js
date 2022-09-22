
// ================== 存放主进程 APP 的事件  ===================== //

import { app, BrowserWindow } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
// import isDevelopment from "@/main/envs/envs";
import DB from '@/main/db';
import path from "path";


export default async function createWindow () {
    const win = new BrowserWindow({
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
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        win.webContents.openDevTools();
        // if (isDevelopment) win.webContents.openDevTools();
    } else {
        createProtocol('app');
        // Load the index.html when not in development
        win.loadURL('app://./index.html');
    }
    // 窗口尺寸改变事件
    win.on('resize', () => {
        const docHeight = win.getSize()[1] - 230;
        const docWidth = win.getSize()[0];
        win.webContents.send("ipc_win_resize", { height: docHeight, width: docWidth });
    });
    // 窗口显示的时候给渲染进程发送初始窗口尺寸
    const docHeight = win.getSize()[1] - 230;
    const docWidth = win.getSize()[0];
    win.webContents.send("ipc_win_resize", { height: docHeight, width: docWidth });

    // 程序运行目录 查询是否已经设置好root密码
    const dbPath = path.join(app.getPath('userData'), 'data.db');
    const db = DB(dbPath);
    // db.run("INSERT INTO user (account,password) VALUES(?,?)", "root", "p_" + Math.random());

    let account = null;
    const check = new Promise((resolve) => {
        db.all("SELECT account FROM user where account = 'root' LIMIT 1", (err, row) => {
            resolve(row);
        });
    });
    await check.then((val) => { account = val.length > 0 ? val[0].account : null; });

    // console.log(account);

    win.webContents.send("ipc_recive_app_info", {
        app_name: app.getName(),
        app_version: app.getVersion(),
        app_path: app.getAppPath(),
        db_path: dbPath,
        is_init_root: account == null ? false : true
    });

}