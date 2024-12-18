/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 15:51:43
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-05 10:16:30
 * @FilePath: \5G_TELEC_TEST\src\main\db\createDataBaseClass.ts
 * @Description: 监听渲染进程事件
 *
 */
// import path from 'path';
// import { appConfigFilePath } from '@main/publicData';
// const { Database } = require('sqlite3').verbose();
// const filepath = path.join(appConfigFilePath, 'app/app.db');

// export default new Database(filepath);

import { Database, Statement } from 'sqlite3';
type ColumnItemType = {
  key: string;
  type: string;
};
export default class CreateDataBaseClass {
  private filepath: string;
  public db: Database; // SQLite3 Database 类型
  constructor(filepath: string) {
    // this.filepath = path.join(appConfigFilePath, 'app/app.db');
    this.filepath = filepath;
    this.db = new Database(filepath);
  }

  open(): void {
    this.db = new Database(this.filepath);
  }

  close(): void {
    this.db.close((err: Error | null) => {
      if (err) {
        throw err;
      }
    });
  }

  //表是否存在
  private async isTableExists(tableName: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT name FROM sqlite_master WHERE type='table' AND name=?";
      this.db.get(query, [tableName], (err: Error | null, row: any) => {
        if (err) {
          reject(err);
        }
        const exists: boolean = !!row;
        resolve(exists);
      });
    });
  }
  //删除表内容与结构
  private async dropTable(tableName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const query = `DROP TABLE IF EXISTS ${tableName}`;
      const callBack = (err: Error | null) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      };
      //执行语句
      this.db.run(query, callBack);
    });
  }
  //删除表内容
  async deleteTableContent(tableName: string): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      //判断表是否存在
      const flag = await this.isTableExists(tableName);
      if (!flag) {
        return resolve();
      }
      // Query the number of records in the table
      const sql = `SELECT COUNT(*) as count FROM ${tableName}`;
      const callBack = (err: Error | null, row: any) => {
        if (err) {
          reject(err);
        }
        const rowCount = row ? row.count : 0;
        if (rowCount > 0) {
          // Execute the delete operation
          const deleteQuery = `DELETE FROM ${tableName}`;
          this.db.run(deleteQuery, (err: Error | null) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        } else {
          resolve();
        }
      };
      // 执行语句
      this.db.get(sql, callBack);
    });
  }

  private runStatementAsync(
    statement: Statement,
    values: any[],
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      statement.run(...values, function (err: any) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
  //插入数据
  async insertData<T>(
    columnList: ColumnItemType[],
    tableName: string,
    dataList: T[],
    noRebuildTable?: boolean, //是否需要重新建表
  ): Promise<void> {
    try {
      //判断表是否存在
      const flag = await this.isTableExists(tableName);

      //如果表存在,则删掉她
      if (flag) {
        if (!noRebuildTable) {
          await this.dropTable(tableName);
          await this.createTable(columnList, tableName);
        }
      } else {
        await this.createTable(columnList, tableName);
      }

      //处理列
      const filterColumn = columnList.filter((columnItem) => {
        return !['id', 'created_at'].includes(columnItem.key);
      });
      const keyList = filterColumn.map((item) => item.key);
      const placeholders = keyList.map((_key) => `?`).join(',');
      const sql = `INSERT INTO ${tableName} (${keyList.join(
        ',',
      )}) VALUES (${placeholders})`;
      // 创建 Statement 对象 预处理
      const statement = this.db.prepare(sql);
      for (const resultItem of dataList) {
        const valueList = keyList.map((key) => {
          return resultItem[key];
        });
        await this.runStatementAsync(statement, valueList);
      }
      // 关闭 Statement 对象
      statement.finalize();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }
  //建表
  private createTable = (
    columnList: ColumnItemType[],
    tableName: string,
  ): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        //处理列
        const column = columnList.map((columnItem) => {
          const { key, type } = columnItem;
          let tempType = type;
          if (key === 'id') {
            tempType = 'INTEGER PRIMARY KEY';
          } else if (key === 'created_at') {
            // tempType = 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP';
            // tempType = `TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S'))`;
            tempType = `DATETIME DEFAULT (DATETIME('now', 'localtime'))`;
          }
          return `${key} ${tempType}`;
        });
        const columnText = column.join(',');
        const createStatement = `CREATE TABLE IF NOT EXISTS ${tableName} (${columnText})`;
        this.db.run(createStatement, (err: Error) => {
          if (err) {
            reject(err.message);
          } else {
            resolve();
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}
