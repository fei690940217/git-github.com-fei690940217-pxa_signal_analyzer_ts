/*
 * @Author: feifei
 * @Date: 2025-01-09 11:37:47
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 11:39:13
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\ipcMainModule1\util.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { appConfigFilePath } from '@src/main/publicData';
import { mkdir, pathExists } from 'fs-extra';
import path from 'path';

export const createDir = (laseFilePath: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      //1.先以项目名称为名字,创建项目文件夹
      const filePath = path.join(appConfigFilePath, laseFilePath);
      //判断文件是否存在
      const flag = await pathExists(filePath);
      if (flag) {
        reject(new Error('项目已存在'));
      } else {
        await mkdir(filePath);
        resolve();
      }
    } catch (error) {
      reject(error);
    }
  });
};
