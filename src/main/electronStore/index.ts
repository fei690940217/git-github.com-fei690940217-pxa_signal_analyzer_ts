/*
 * @FilePath: \pxa_signal_analyzer\src\main\electronStore\index.ts
 * @Author: xxx
 * @Date: 2023-04-13 09:47:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:25:31
 * @Descripttion:
 */
import path from 'path';
import { outputJson, pathExists, readJson, readJsonSync } from 'fs-extra';

const appConfigFilePath = path.join('D:', 'fcc_5g_test_electron_only_spectrum');
const basePath = path.join(appConfigFilePath, 'app/electron-store');
//需要独立文件的key
const individualFiles = [
  'supSelectedRows',
  'tempResultList',
  'presetList',
  'projectList',
];

export default {
  //实现get方法
  get: (key: string) => {
    if (individualFiles.includes(key)) {
      const filePath = path.join(basePath, `${key}.json`);
      const data = readJsonSync(filePath);
      return data;
    } else {
      const filePath = path.join(basePath, `other.json`);
      const data = readJsonSync(filePath);
      return data[key];
    }
  },
  //实现get方法
  getAsync: async (key: string) => {
    try {
      if (individualFiles.includes(key)) {
        const filePath = path.join(basePath, `${key}.json`);
        const data = await readJson(filePath);
        return Promise.resolve(data);
      } else {
        const filePath = path.join(basePath, `other.json`);
        const data = await readJson(filePath);
        const val = data[key];
        return Promise.resolve(val);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  //实现set方法
  set: async (key: string, value: any) => {
    try {
      if (individualFiles.includes(key)) {
        const filePath = path.join(basePath, `${key}.json`);
        await outputJson(filePath, value);
      } else {
        const filePath = path.join(basePath, `other.json`);
        const data = await readJson(filePath);
        data[key] = value;
        await outputJson(filePath, data);
      }
    } catch (error) {
      console.error(error);
    }
  },
};
