/*
 * @Author: feifei
 * @Date: 2024-01-29 15:28:56
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-03 19:36:03
 * @FilePath: \5G_TELEC_TEST\src\main\db\logDB.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
//logDB
import path from 'path';
import CreateDataBaseClass from './createDataBaseClass';
import { appConfigFilePath } from '@main/publicData';
const filepath = path.join(appConfigFilePath, 'app/log.db');
const DB = new CreateDataBaseClass(filepath);
type logListType = {
  type: string;
  message: string;
};
const columnList = [
  {
    key: 'id',
    type: '',
  },
  {
    key: 'created_at',
    type: '',
  },
  {
    key: 'type',
    type: 'TEXT',
  },
  {
    key: 'message',
    type: 'TEXT',
  },
];

//插入数据
export const insertListTable = async (result: logListType[]): Promise<void> => {
  try {
    await DB.insertData<logListType>(columnList, 'logList', result, true);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
//插入单条数据
export const insertSingleTable = async (
  resultItem: logListType,
): Promise<void> => {
  try {
    await DB.insertData<logListType>(columnList, 'logList', [resultItem], true);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
export const getLogListBylimitNumber = async (limitNumber: number) => {
  try {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM logList ORDER BY id DESC LIMIT ${limitNumber};`;
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        resolve(rows);
        return;
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
//获取全部的log
export const getAllLogList = async () => {
  try {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM logList ORDER BY id DESC ;`;
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        resolve(rows);
        return;
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
//清空log
export const deleteAllLogContent = async () => {
  try {
    await DB.deleteTableContent('logList');
  } catch (error) {
    throw error;
  }
};
