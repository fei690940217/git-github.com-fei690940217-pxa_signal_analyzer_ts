/*
 * @FilePath: \pxa_signal_analyzer\src\main\electronStore\index.ts
 * @Author: xxx
 * @Date: 2023-04-13 09:47:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 10:26:57
 * @Descripttion:
 */
import path from 'path';
import {
  outputJson,
  outputFile,
  pathExists,
  pathExistsSync,
  readJson,
  readJsonSync,
  readFile,
  readFileSync,
  writeJson,
} from 'fs-extra';
import { logError } from '@src/main/logger/logLevel';
const appConfigFilePath = path.join('D:', 'fcc_5g_test_electron_only_spectrum');
const basePath = path.join(appConfigFilePath, 'app/electron-store');
export default {
  //实现get方法
  get: (key: string) => {
    try {
      const filePath = path.join(basePath, `${key}.${'json'}`);
      const flag = pathExistsSync(filePath);
      if (!flag) {
        return null;
      }
      const tempData = readFileSync(filePath, 'utf8');
      const trimStr = tempData?.trim();
      if (trimStr) {
        const data = JSON.parse(tempData);
        return data;
      } else {
        return null;
      }
    } catch (error) {
      const errmsg = `electronStore get ${key} 出错${error?.toString()}`;
      logError(errmsg);
      return null;
    }
  },
  //实现get方法
  getAsync: async (key: string) => {
    try {
      const filePath = path.join(basePath, `${key}.json`);
      const flag = pathExistsSync(filePath);
      if (!flag) {
        return Promise.resolve(null);
      }
      const tempData = await readFile(filePath, 'utf8');
      const trimStr = tempData?.trim();
      if (trimStr) {
        const data = JSON.parse(trimStr);
        return Promise.resolve(data);
      } else {
        return Promise.resolve(null);
      }
    } catch (error) {
      const errmsg = `electronStore getAsync ${key} 出错${error?.toString()}`;
      logError(errmsg);
      return Promise.resolve(null);
    }
  },
  //实现set方法
  set: async (key: string, value: any) => {
    try {
      const filePath = path.join(basePath, `${key}.json`);
      await outputJson(filePath, value);
      return;
    } catch (error) {
      console.error(error);
      const errmsg = `electronStore set ${key} 出错${error?.toString()}`;
      logError(errmsg);
    }
  },
};
