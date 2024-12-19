/*
 * @FilePath: \pxa_signal_analyzer\src\main\publicData\electron-store.js
 * @Author: xxx
 * @Date: 2023-04-13 09:47:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 09:32:58
 * @Descripttion:
 */
const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const { outputJson, pathExists, readJson } = require('fs-extra');

const appConfigFilePath = path.join('D:', 'fcc_5g_test_electron_only_spectrum');
const basePath = path.join(appConfigFilePath, 'app/electron-store');
//需要独立文件的key
const individualFiles = [
  'supSelectedRows',
  'tempResultList',
  'presetList',
  'projectList',
];

module.exports = {
  //实现get方法
  get: (key) => {
    if (individualFiles.includes(key)) {
      const filePath = path.join(basePath, `${key}.json`);
      const data = fs.readFileSync(filePath, 'utf-8');
      if (data) {
        return JSON.parse(data);
      } else {
        return data;
      }
    } else {
      const filePath = path.join(basePath, `other.json`);
      const data = fs.readFileSync(filePath, 'utf-8');
      const jsonData = JSON.parse(data);
      return jsonData[key];
    }
  },
  //实现get方法
  getAsync: async (key) => {
    try {
      if (individualFiles.includes(key)) {
        const filePath = path.join(basePath, `${key}.json`);
        const data = await readJson(filePath, 'utf-8');
        return Promise.resolve(data);
      } else {
        const filePath = path.join(basePath, `other.json`);
        const data = await readJson(filePath, 'utf-8');
        const val = data[key];
        return Promise.resolve(val);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  },
  //实现set方法
  set: async (key, value) => {
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
