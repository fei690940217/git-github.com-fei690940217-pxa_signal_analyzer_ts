import { BandInfoType } from '@t/main';
import CreateDataBaseClass from './createDataBaseClass';
import { appDBFilepath } from './functionList';
const columnList = [
  {
    key: 'id',
    type: '',
  },
  {
    key: 'bandType',
    type: 'TEXT',
  },
  {
    key: 'Band',
    type: 'TEXT',
  },
  {
    key: 'FL',
    type: 'REAL',
  },
  {
    key: 'FH',
    type: 'REAL',
  },
  {
    key: 'CSE_Limit',
    type: 'TEXT',
  },
  {
    key: 'LOW_Limit_PC2',
    type: 'REAL',
  },
  {
    key: 'UP_Limit_PC2',
    type: 'REAL',
  },

  {
    key: 'LOW_Limit_PC3',
    type: 'REAL',
  },
  {
    key: 'UP_Limit_PC3',
    type: 'REAL',
  },
  {
    key: 'duplexMode',
    type: 'TEXT',
  },
];
//插入数据
export const insertTable = async (result: BandInfoType[]): Promise<void> => {
  try {
    const DB = new CreateDataBaseClass(appDBFilepath);
    //插入数据
    await DB.insertData<BandInfoType>(columnList, 'BandList', result);
    DB.close();
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const getBandList = async () => {
  try {
    return new Promise((resolve, reject) => {
      const DB = new CreateDataBaseClass(appDBFilepath);
      const query = 'SELECT * FROM BandList';
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
