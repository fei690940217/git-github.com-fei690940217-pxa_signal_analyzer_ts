/*
 * @Author: feifei
 * @Date: 2024-12-18 15:44:42
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 16:30:16
 * @FilePath: \pxa_signal_analyzer\src\renderer\utils\electronStore.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
const { ipcRenderer } = window.myApi;
import { logError } from './logLevel';
//设置
export const electronStoreSet = (key: string, val: any) => {
  try {
    //electron-store-set
    ipcRenderer.send('electron-store-set', { key, val });
  } catch (error) {
    logError(error?.toString());
  }
};
//同步版本的获取
export const electronStoreGet = (key: string) => {
  try {
    return ipcRenderer.sendSync('electron-store-get', key);
  } catch (error) {
    logError(error?.toString());
    return null;
  }
};
//异步获取
export const electronStoreGetAsync = async (key: string) => {
  try {
    const data = await ipcRenderer.invoke('electron-store-get-async', key);
    return data;
  } catch (error) {
    logError(error?.toString());
    return null;
  }
};
