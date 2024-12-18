/*
 * @Author: feifei
 * @Date: 2024-01-31 20:04:18
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-03 17:42:41
 * @FilePath: \5G_TELEC_TEST\src\main\db\ARFCNConfigDB.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
//ARFCNConfigDB
import CreateDataBaseClass from './createDataBaseClass';
import { appDBFilepath } from './functionList';
import { ARFCNItemType } from '@t/main';

const columnList = [
  {
    key: 'id',
    type: '',
  },
  {
    key: 'SCS',
    type: 'INTEGER',
  },
  {
    key: 'Band',
    type: 'TEXT',
  },
  {
    key: 'BW',
    type: 'INTEGER',
  },
  {
    key: 'Link',
    type: 'TEXT',
  },
  {
    key: 'Level',
    type: 'TEXT',
  },
  {
    key: 'Freq',
    type: 'REAL',
  },
  {
    key: 'Arfcn',
    type: 'REAL',
  },
];

//插入数据
export const insertTable = async (result: ARFCNItemType[]): Promise<void> => {
  try {
    const DB = new CreateDataBaseClass(appDBFilepath);
    //插入数据
    await DB.insertData<ARFCNItemType>(columnList, 'ARFCNConfig', result);
    DB.close()
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getARFCNList = async () => {
  try {
    return new Promise((resolve, reject) => {
      const DB = new CreateDataBaseClass(appDBFilepath);
      const query = 'SELECT * FROM ARFCNConfig';
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        resolve(rows);
        DB.close();
        return;
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
