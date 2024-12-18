/*
 * @Author: feifei
 * @Date: 2023-12-22 14:22:09
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-03 17:43:30
 * @FilePath: \5G_TELEC_TEST\src\main\db\RBConfigDB.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { RBSCSItemType } from '@t/main';
import CreateDataBaseClass from './createDataBaseClass';
import { appDBFilepath } from './functionList';
const columnList = [
  {
    key: 'id',
    type: '',
  },
  {
    key: 'testItem',
    type: 'TEXT',
  },
  {
    key: 'SCS',
    type: 'INTEGER',
  },
  {
    key: 'BW',
    type: 'INTEGER',
  },
  {
    key: 'Modulation',
    type: 'TEXT',
  },
  {
    key: 'RBName',
    type: 'TEXT',
  },
  {
    key: 'RBNum',
    type: 'INTEGER',
  },
  {
    key: 'RBStart',
    type: 'INTEGER',
  },
];

//插入数据
export const insertTable = async (result: RBSCSItemType[]): Promise<void> => {
  try {
    const DB = new CreateDataBaseClass(appDBFilepath);
    //插入数据
    await DB.insertData<RBSCSItemType>(columnList, 'RBConfig', result);
    DB.close();
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getRBConfig = async (): Promise<RBSCSItemType[]> => {
  try {
    return new Promise((resolve, reject) => {
      const DB = new CreateDataBaseClass(appDBFilepath);
      const query = 'SELECT * FROM RBConfig';
      DB.db.all(query, [], (err: Error | null, rows: RBSCSItemType[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        DB.close();
        return resolve(rows);
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
