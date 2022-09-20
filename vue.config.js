const { defineConfig } = require('@vue/cli-service');

// console.log(process.env.NODE_ENV);

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    externals: {
      "fs": "require('fs')",
      "electron": "window.require('electron')"
    },
  },
  //判断开发模式还是生产模式
  // publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  //插件配置
  pluginOptions: {
    //electronBuilder配置
    electronBuilder: {
      builderOptions: {
        "productName": 'Mysec',//生成exe的名字
        "appId": "dev.darifo.mysec",//包名  
        "copyright": "Copyright © 2022 by darifo",//版权信息
        "directories": { // 输出文件夹
          "output": "dist_electron",
        },
        "nsis": {
          "oneClick": false, // 是否一键安装
          "allowElevation": true, // 允许请求提升。若为false，则用户必须使用提升的权限重新启动安装程序。
          "allowToChangeInstallationDirectory": true, //是否允许修改安装目录
          "installerIcon": "resource/icons/win/icon.ico",// 安装时图标
          "uninstallerIcon": "resource/icons/win/icon.ico",//卸载时图标
          "installerHeaderIcon": "resource/icons/win/icon.ico", // 安装时头部图标
          "createDesktopShortcut": true, // 是否创建桌面图标
          "createStartMenuShortcut": true,// 是否创建开始菜单图标
          "shortcutName": "Mysec", // 快捷方式名称
          "runAfterFinish": false,//是否安装完成后运行
        },
        "dmg": {
          "contents": [
            {
              "x": 410,
              "y": 150,
              "type": "link",
              "path": "/Applications"
            },
            {
              "x": 130,
              "y": 150,
              "type": "file"
            }
          ]
        },
        "win": {
          "icon": "resource/icons/win/icon.ico",//图标路径
          "target": [
            {
              "target": "nsis", //利用nsis制作安装程序
              "arch": [
                "x64", //64位
                // "ia32" //32位
              ]
            }
          ]
        },
        "mac": {
          // "target": "dmg",
          "icon": "resource/icons/mac/icon.icns"
        },
      }
    }
  }
});
