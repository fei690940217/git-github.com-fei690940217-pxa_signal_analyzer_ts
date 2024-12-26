/*
 * @FilePath: \pxa_signal_analyzer\src\main\electronStore\index.ts
 * @Author: xxx
 * @Date: 2023-04-13 09:47:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-24 15:01:55
 * @Descripttion:
 */
import path from 'path';
import {
  outputJson,
  pathExists,
  pathExistsSync,
  readJson,
  readJsonSync,
  readFile,
  readFileSync,
  writeJson,
} from 'fs-extra';

const appConfigFilePath = path.join('D:', 'fcc_5g_test_electron_only_spectrum');
const basePath = path.join(appConfigFilePath, 'app/electron-store');

export default {
  //实现get方法
  get: (key: string) => {
    try {
      const filePath = path.join(basePath, `other.json`);
      const flag = pathExistsSync(filePath);
      if (!flag) {
        return null;
      }
      const tempData = readFileSync(filePath, 'utf8');
      if (tempData?.trim()) {
        const data = JSON.parse(tempData);
        return data[key];
      } else {
        return null;
      }
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  //实现get方法
  getAsync: async (key: string) => {
    try {
      const filePath = path.join(basePath, `other.json`);
      const a = await readFile(filePath, 'utf8');
      let data = {};
      if (a?.trim()) {
        data = JSON.parse(a);
        const val = data[key];
        return Promise.resolve(val);
      } else {
        return Promise.resolve(null);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  //实现set方法
  set: async (key: string, value: any) => {
    try {
      const filePath = path.join(basePath, `other.json`);
      const a = await readFile(filePath, 'utf8');
      let data = {};
      if (a?.trim()) {
        data = JSON.parse(a);
      }
      data[key] = value;
      await outputJson(filePath, data);
    } catch (error) {
      console.error(error);
    }
  },
};
