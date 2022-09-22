'use strict';

import { protocol, Menu } from 'electron';
import AppMenu from '@/main/menu/menu';

// 注册app
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
]);

// 绑定应用菜单
let menuBuilder = Menu.buildFromTemplate(AppMenu);
Menu.setApplicationMenu(menuBuilder);

// 引入模块
require('@/main/app-init');
require('@/main/app-events');
require('@/main/ipcs');
