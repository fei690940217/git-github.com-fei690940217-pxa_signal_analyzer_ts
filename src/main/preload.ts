/*
 * @Author: feifei
 * @Date: 2023-09-27 09:20:05
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-25 17:10:10
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

import baseURL from './publicData/baseURL';
const { promises: fsPromises } = fs;
export type Channels = 'ipc-example';

const electronHandler = {
  ipcRenderer: ipcRenderer,
  ipcRendererOn: (
    channel: string,
    listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void,
  ) => {
    ipcRenderer.removeAllListeners(channel); // 先移除旧的监听器
    ipcRenderer.on(channel, listener); // 再添加新的监听器
  },
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
