/*
 * @Author: feifei
 * @Date: 2023-09-28 16:23:13
 * @LastEditors: feifei
 * @LastEditTime: 2023-10-07 11:55:29
 * @FilePath: \electron-react-boilerplate-main\src\renderer\preload.d.ts
 * @Description:预加载文件的ts声明文件
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { ElectronHandler } from '@main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    myApi: ElectronHandler;
  }
}

export {};
