/*
 * @Author: feifei
 * @Date: 2023-11-28 09:34:21
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-03 12:18:38
 * @FilePath: \5G_TELEC_TEST\src\main\db\functionList.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { appConfigFilePath } from '@main/publicData';
import path from 'path';
import CreateDataBaseClass from './createDataBaseClass';
export const appDBFilepath = path.join(appConfigFilePath, 'app/app.db');

//根据项目名称创建数据库
export const getProjectDB = async (projectName: string) => {
  try {
    const dbFilePath = path.join(
      appConfigFilePath,
      'user/project/',
      projectName,
      `${projectName}.db`,
    );
    const db = new CreateDataBaseClass(dbFilePath);
    return Promise.resolve(db);
  } catch (error) {
    return Promise.reject(error);
  }
};
