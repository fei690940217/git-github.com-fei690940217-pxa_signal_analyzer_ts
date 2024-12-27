/*
 * @FilePath: \pxa_signal_analyzer\src\main\appEventHandle\AppMenuList.ts
 * @Author: xxx
 * @Date: 2022-07-25 14:48:03
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 13:19:52
 * @Descripttion: 菜单数据
 */
import { app } from 'electron';
import { type MenuItemConstructorOptions } from 'electron';

import { mainSendRender } from '../utils/index';
// 右键菜单
export const contextTemplate: MenuItemConstructorOptions[] = [
  {
    label: '刷新页面',
    accelerator: 'F5',
    role: 'reload',
  },
  {
    label: '首页',
    click: () => {
      mainSendRender('navigate', '/');
    },
  },
  {
    label: '新建页',
    click: () => {
      mainSendRender('navigate', '/add');
    },
  },
  {
    label: '设置页',
    click: () => {
      mainSendRender('navigate', '/set');
    },
  },
  {
    label: '重启',
    click: () => {
      app.relaunch();
    },
  },
  {
    label: '放大',
    accelerator: 'Ctrl+=',
    role: 'zoomIn',
  },
  {
    label: '缩小',
    accelerator: 'Ctrl+-',
    role: 'zoomOut',
  },
  {
    label: '重置缩放',
    accelerator: 'Ctrl+0',
    role: 'resetZoom',
  },
  {
    label: '开发者工具',
    accelerator: 'F12',
    role: 'toggleDevTools',
  },
];
// let template = [
//      {
//           label: '窗口',
//           submenu: [
//                {
//                     label: '立即退出',
//                     role: 'close'
//                }]
//      },
//      {
//           label: '查看',
//           submenu: [
//                {
//                     label: '刷新页面',
//                     accelerator: "F5",
//                     role: 'reload',
//                },
//                {
//                     label: '系统日志',
//                     click: (item, focusedWindow) => {
//                          if (focusedWindow) {
//                               focusedWindow.webContents.send('open-log')
//                          }
//                     }
//                },
//                {
//                     label: '开发者工具',
//                     accelerator: "F12",
//                     role: 'toggledevtools',
//                }]
//      }, {
//           label: '帮助',
//           submenu: [{
//                label: '版本:v1.0.0',
//                enabled: false
//           },]
//      }
// ]

// app.on('ready', () => {
//      //添加系统菜单
//      const menu = Menu.buildFromTemplate(template)
//      Menu.setApplicationMenu(menu)
// })
