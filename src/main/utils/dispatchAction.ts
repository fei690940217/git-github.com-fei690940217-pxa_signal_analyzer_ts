/*
 * @Author: feifei
 * @Date: 2024-12-17 16:22:46
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 14:58:04
 * @FilePath: \pxa_signal_analyzer\src\main\utils\dispatchAction.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { getWindow } from '@src/main/windowManage/mainWindow';

//obj ={key:'addLog',value:'xxx'}
type ParamsType = {
  key: string;
  value?: any;
}
export default (obj: ParamsType) => {
  //找到主进程
  const win = getWindow();
  if (win?.webContents) {
    const webContents = win?.webContents;
    webContents.send('dispatchAction', obj);
  }
};
