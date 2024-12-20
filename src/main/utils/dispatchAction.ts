/*
 * @Author: feifei
 * @Date: 2024-12-17 16:22:46
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:32:18
 * @FilePath: \pxa_signal_analyzer\src\main\utils\dispatchAction.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { getWindow } from '@src/main/windowManager';

//obj ={key:'addLog',value:'xxx'}
export default (obj) => {
  //找到主进程
  const win = getWindow();
  if (win?.webContents) {
    const webContents = win?.webContents;
    webContents.send('dispatchAction', obj);
  }
};
