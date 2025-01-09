/*
 * @FilePath: \pxa_signal_analyzer\src\main\addWindow\MenuList.ts
 * @Author: xxx
 * @Date: 2022-07-25 14:48:03
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 13:17:14
 * @Descripttion: 菜单数据
 */
import { app } from 'electron';
import { type MenuItemConstructorOptions } from 'electron';
// 右键菜单
export const contextTemplate: MenuItemConstructorOptions[] = [
  {
    label: '刷新页面',
    accelerator: 'F5',
    role: 'reload',
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
