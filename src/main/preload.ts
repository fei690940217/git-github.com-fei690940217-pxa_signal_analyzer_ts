/*
 * @Author: feifei
 * @Date: 2023-09-27 09:20:05
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:04:26
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
import {
  appConfigFilePath,
  jizhanConnectionName,
  lineLossConnectionName,
} from './publicData';

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
  jizhanConnectionName,
  lineLossConnectionName,
  baseURL,
  electronStore: {
    get(key: string) {
      return ipcRenderer.sendSync('electron-store-get', key);
    },
    set(key: string, val: any) {
      ipcRenderer.send('electron-store-set', key, val);
    },
  },
};

contextBridge.exposeInMainWorld('myApi', electronHandler);

export type ElectronHandler = typeof electronHandler;
