/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 15:51:43
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-03 17:48:29
 * @FilePath: \5G_TELEC_TEST\src\main\db\projectDB.ts
 * @Description: 监听渲染进程事件
 *
 */
import { getProjectDB } from './functionList';
import { testItemList } from '@src/common';
import { ResultItemType } from '@src/customTypes/resultType';
const columnList = [
  { key: 'id', type: '' },
  { key: 'networkMode', type: 'TEXT' },
  { key: 'testItem', type: 'TEXT' },
  { key: 'testItemId', type: 'TEXT' },
  { key: 'Band', type: 'TEXT' },
  { key: 'BandId', type: 'TEXT' },
  { key: 'LTE_Band', type: 'TEXT' },
  { key: 'supId', type: 'TEXT' },
  { key: 'SCS', type: 'INTEGER' },
  { key: 'BW', type: 'INTEGER' },
  { key: 'ARFCN', type: 'REAL' },
  { key: 'PowerClass', type: 'INTEGER' },
  { key: 'duplexMode', type: 'TEXT' },
  { key: 'LTE_duplexMode', type: 'TEXT' },
  { key: 'LOW_Limit', type: 'REAL' },
  { key: 'UP_Limit', type: 'REAL' },
  { key: 'LTE_ARFCN', type: 'REAL' },
  { key: 'LTE_FREQ', type: 'REAL' },
  { key: 'DLFreq', type: 'REAL' },
  { key: 'level', type: 'TEXT' },
  { key: 'Modulation', type: 'TEXT' },
  { key: 'RBName', type: 'TEXT' },
  { key: 'RBNum', type: 'INTEGER' },
  { key: 'RBStart', type: 'INTEGER' },
  { key: 'result', type: 'TEXT' },
];

const testItemOrder = testItemList.map((item, index) => {
  return `WHEN '${item.value}' THEN ${index + 1}`;
});
const sortOrder = `CASE testItem
                        ${testItemOrder.join('\n')}
                  END,
                  CAST(SUBSTR(Band, 2) AS INTEGER)`;

//获取子项目的所有条目
export const getSubProjectAllList = async (
  projectName: string,
  subProjectName: string,
) => {
  try {
    const DB = await getProjectDB(projectName);
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM ${subProjectName}`;
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        resolve(rows);
        //关闭数据库
        DB.close();
      });
    });
  } catch (error) {
    return Promise.reject(error);
  }
};
//新建或编辑项目
export const addEditProject = (params: {
  projectName: string;
  result: ResultItemType[];
}) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const { projectName, result } = params;
      //新建或获取数据库
      const DB = await getProjectDB(projectName);
      //创建resultList表
      await DB.insertData(columnList, 'resultList', result);
      DB.close();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
//获取左侧菜单栏数据
export const getLeftMenuListDB = (payload: {
  projectName: string;
  subProjectName: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { projectName, subProjectName } = payload;
      console.log(projectName, subProjectName);
      const DB = await getProjectDB(projectName);
      //判断那哪一个表
      const tableName = subProjectName ? subProjectName : 'resultList';
      const query = `SELECT
                  id,
                  networkMode,
                  testItemId,
                  testItem,
                  Band,
                  BandId,
                  LTE_Band
                  FROM ${tableName}
                  GROUP BY testItemId,BandId
                  ORDER BY
                  ${sortOrder}
                  `;
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
          return;
        }
        // 在这里对查询结果进行分类整理
        resolve(rows);
        DB.close();
      });
    } catch (error) {
      reject(error);
    }
  });
};
//获取测试用例表
export const getTestItemList = (payload: {
  projectName: string;
  subProjectName: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { projectName, subProjectName } = payload;
      const DB = await getProjectDB(projectName);
      //判断那哪一个表
      const query = `SELECT
                  testItemId,
                  testItem
                  FROM ${subProjectName}
                  GROUP BY testItemId
                  ORDER BY
                  CASE testItem
                        ${testItemOrder.join('\n')}
                  END
                  `;
      console.log(query);
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
          return;
        }
        // 在这里对查询结果进行分类整理
        resolve(rows);
        DB.close();
      });
    } catch (error) {
      reject(error);
    }
  });
};
//testItemId   根据这两个参数获取测试条目
export const getResultListByTestItemId = (payload: {
  projectName: string;
  subProjectName: string;
  testItemId: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { projectName, subProjectName, testItemId } = payload;
      const DB = await getProjectDB(projectName);
      //判断那哪一个表
      const tableName = subProjectName ? subProjectName : 'resultList';
      const query = `SELECT *
                      FROM ${tableName}
                      WHERE testItemId = '${testItemId}'
                      ORDER BY BW ASC,
                      CASE level
                        WHEN 'Low' THEN 1
                        WHEN 'Mid' THEN 2
                        WHEN 'High' THEN 3
                      END,
                      CAST(SUBSTR(Band, 2) AS INTEGER)
                `;
      console.log(query);
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        // 在这里对查询结果进行分类整理
        resolve(rows);
        DB.close();
      });
    } catch (error) {
      reject(error);
    }
  });
};
//testItemId  BandId 根据这两个参数获取测试条目
export const getResultListByTestItemAndBandDB = (payload: {
  projectName: string;
  subProjectName: string;
  testItemId: string;
  BandId: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { projectName, subProjectName, testItemId, BandId } = payload;
      const DB = await getProjectDB(projectName);
      //判断那哪一个表
      const tableName = subProjectName ? subProjectName : 'resultList';
      const query = `SELECT *
                      FROM ${tableName}
                      WHERE testItemId = '${testItemId}' AND BandId = '${BandId}'
                      ORDER BY BW ASC,
                      CASE level
                        WHEN 'Low' THEN 1
                        WHEN 'Mid' THEN 2
                        WHEN 'High' THEN 3
                      END
                `;
      DB.db.all(query, [], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        // 在这里对查询结果进行分类整理
        resolve(rows);
        DB.close();
      });
    } catch (error) {
      reject(error);
    }
  });
};

//getResultRowById
export const getResultRowById = (payload: {
  projectName: string;
  subProjectName: string;
  id: number;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { projectName, subProjectName, id } = payload;
      const DB = await getProjectDB(projectName);
      //判断那哪一个表
      const query = `
                    SELECT * FROM ${subProjectName}
                    WHERE id = ?
                  `;
      DB.db.get(query, [id], (err: Error | null, row: ResultItemType[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        // 在这里对查询结果进行分类整理
        resolve(row);
        DB.close();
      });
    } catch (error) {
      reject(error);
    }
  });
};
//更新结果 ById
export const updateResultById = (payload: {
  projectName: string;
  subProjectName: string;
  id: string;
  result: any;
}) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const { projectName, subProjectName, result, id } = payload;
      const DB = await getProjectDB(projectName);
      //判断那哪一个表
      const updateQuery = `
                    UPDATE ${subProjectName}
                    SET result = ?
                    WHERE id = ?
                `;
      DB.db.run(updateQuery, [result, id], function (err) {
        if (err) {
          throw err;
        }
        // 检查是否有行受影响
        if (this.changes > 0) {
          resolve();
        } else {
          reject('未找到此条数据');
        }
        DB.close();
      });
    } catch (error) {
      reject(error);
    }
  });
};

//getResultListByTestItem  生成测试报告使用
export const getResultListByTestItem = (payload: {
  projectName: string;
  subProjectName: string;
  testItem: string;
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { projectName, subProjectName, testItem } = payload;
      const DB = await getProjectDB(projectName);
      //判断那哪一个表
      const query = `SELECT *
                      FROM ${subProjectName}
                      WHERE testItem = ?
                      ORDER BY BW ASC,
                      CASE level
                        WHEN 'Low' THEN 1
                        WHEN 'Mid' THEN 2
                        WHEN 'High' THEN 3
                      END
                `;
      DB.db.all(query, [testItem], (err: Error | null, rows: any[]) => {
        if (err) {
          console.error(err.message);
          reject(err.message);
        }
        resolve(rows);
        DB.close();
      });
    } catch (error) {
      reject(error);
    }
  });
};
