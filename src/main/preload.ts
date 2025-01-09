/*
 * @Author: feifei
 * @Date: 2023-09-27 09:20:05
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 14:23:56
 * @FilePath: \pxa_signal_analyzer\src\main\preload.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import path from 'path';
import fs from 'fs';
import { appConfigFilePath } from './publicData';
console.log('ipcRenderer', ipcRenderer);
import baseURL from './publicData/baseURL';
const { promises: fsPromises } = fs;
export type Channels = 'ipc-example';
ipcRenderer.on('port', (e) => {
  // 接收到端口，使其全局可用。
  window.electronMessagePort = e.ports[0];
});
const ipcApi = {
  // 异步请求：向主进程发送消息并获取响应
  invoke: <T>(channel: string, ...args: any[]): Promise<T> => {
    return ipcRenderer.invoke(channel, ...args);
  },
  // 发送消息到主进程，不等待响应
  send: (channel: string, ...args: any[]): void => {
    ipcRenderer.send(channel, ...args);
  },
  // 同步请求：向主进程发送消息并等待同步响应
  sendSync: <T>(channel: string, ...args: any[]): T => {
    return ipcRenderer.sendSync(channel, ...args);
  },
};
const electronHandler = {
  ipcRenderer: ipcApi,
  ipcRendererOn: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.removeAllListeners(channel); // 先移除旧的监听器
    ipcRenderer.on(channel, listener); // 再添加新的监听器
  },
  ipcRendererOnce: ipcRenderer.once.bind(ipcRenderer),
  ipcRendererOff: ipcRenderer.off.bind(ipcRenderer),
  removeListener: ipcRenderer.removeListener.bind(ipcRenderer),
  path,
  fsPromises,
  fs,
  appConfigFilePath,
  baseURL,
};

contextBridge.exposeInMainWorld('myApi', electronHandler);

export type ElectronHandler = typeof electronHandler;
