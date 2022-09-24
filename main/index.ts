import { app, BrowserWindow, Menu, shell } from 'electron';
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer';
import path from 'path';
import DB from "./db";
import AppMenu from "./menu"

process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

// 绑定应用菜单
let menuBuilder = Menu.buildFromTemplate(AppMenu);
Menu.setApplicationMenu(menuBuilder);

const createWindow = async () => {
    const win = new BrowserWindow({
        height: 600,
        width: 900,
        minHeight: 600,
        minWidth: 900,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    if (app.isPackaged) {
        await win.loadFile(path.join(__dirname, '../index.html'));
    } else {
        const url = `http://${process.env['VITE_DEV_SERVER_HOSTNAME']}:${process.env['VITE_DEV_SERVER_PORT']}`;
        await win.loadURL(url);
        win.webContents.openDevTools()
    }



    // 窗口尺寸改变事件
    win.on('resized', () => {
        const docHeight = win.getSize()[1] - 200;
        const docWidth = win.getSize()[0];
        console.log(docHeight, docWidth);
        win.webContents.send("ipc_win_resize", { height: docHeight, width: docWidth });
    });
    // 窗口显示的时候给渲染进程发送初始窗口尺寸
    const docHeight = win.getSize()[1] - 200;
    const docWidth = win.getSize()[0];
    console.log(docHeight, docWidth);
    win.webContents.send("ipc_win_resize", { height: docHeight, width: docWidth });

    // 程序运行目录 查询是否已经设置好root密码
    const dbPath = path.join(app.getPath('userData'), 'data.db');
    const db = DB(dbPath);
    // db.run("INSERT INTO user (account,password) VALUES(?,?)", "root", "p_" + Math.random());

    let account = null;
    const check = new Promise((resolve) => {
        db.all("SELECT account FROM user where account = 'root' LIMIT 1", (err: string, row: Object) => {
            resolve(row);
        });
    });
    type Row = {
        length: number
        account: string
    }
    await check.then((val: any) => { account = val.length > 0 ? val[0].account : null; });

    win.webContents.send("ipc_recive_app_info", {
        app_name: app.getName(),
        app_version: app.getVersion(),
        app_path: app.getAppPath(),
        db_path: dbPath,
        is_init_root: account == null ? false : true
    });

};


app.whenReady().then(async () => {
    createWindow();
    app.on('activate', () => {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
    if (!app.isPackaged) {
        await installExtension(VUEJS_DEVTOOLS);
    }
});



app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// 拦截渲染进程里面的所有新开窗口事件，用默认浏览器打开
app.on('web-contents-created', (e, webContents) => {
    webContents.on('new-window', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });
});