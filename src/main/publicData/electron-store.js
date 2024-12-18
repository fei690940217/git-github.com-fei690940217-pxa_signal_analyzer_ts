/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\publicData\electron-store.js
 * @Author: xxx
 * @Date: 2023-04-13 09:47:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 13:24:11
 * @Descripttion:
 */
const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const appConfigFilePath = path.join('D:', 'fcc_5g_test_electron_only_spectrum')
const basePath = path.join(appConfigFilePath, "app/electron-store");
//需要独立文件的key
const individualFiles = [
  "supSelectedRows",
  "tempResultList",
  "presetList",
  "projectList",
];

module.exports = {
  //实现get方法
  get: (key) => {
    if (individualFiles.includes(key)) {
      const filePath = path.join(basePath, `${key}.json`);
      const data = fs.readFileSync(filePath, "utf-8");
      if (data) {
        return JSON.parse(data);
      } else {
        return data;
      }
    } else {
      const filePath = path.join(basePath, `other.json`);
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(data);
      return jsonData[key];
    }
  },
  //实现set方法
  set: (key, value) => {
    if (individualFiles.includes(key)) {
      const filePath = path.join(basePath, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(value));
    } else {
      const filePath = path.join(basePath, `other.json`);
      const data = fs.readFileSync(filePath, "utf-8");
      const jsonData = JSON.parse(data);
      jsonData[key] = value;
      fs.writeFileSync(filePath, JSON.stringify(jsonData));
    }
  },
};
