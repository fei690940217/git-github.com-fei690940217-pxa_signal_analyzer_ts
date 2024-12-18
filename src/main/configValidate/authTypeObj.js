/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\configValidate\authTypeObj.js
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 09:49:49
 * @Descripttion:CSE limit与Band对照表
 */

const fsPromises = require("fs").promises;
const path = require("path");
const { appConfigFilePath } = require("../publicData");
const xlsx = require("node-xlsx").default;
const { outputJson, pathExists, readJson } = require("fs-extra");
const { logError } = require("../logger/logLevel");

const reg = /\s/g;
//配置文件地址
const configFilePath = path.join(
  appConfigFilePath,
  "user/operating bands/NR认证频段.xlsx"
);
//写入本地
const filePath = path.join(appConfigFilePath, "app/authTypeObj.json");

module.exports = async (isRefresh) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(filePath)
      if (flag) {
        return Promise.resolve()
      }
    }
    const resultObj = {};
    //判断文件是否存在
    await fsPromises.access(configFilePath);
    const workSheetsList = xlsx.parse(configFilePath);
    for (let workbook of workSheetsList) {
      const { name, data } = workbook;
      const tempName = name.replace(reg, "");
      const tempArr = [];
      //去掉表头
      const newWorksheet = data.slice(1);
      //生成表名
      for (let item of newWorksheet) {
        // duplexMode双工模式 TDD/FDD
        const [
          tempBand,
          FL,
          FH,
          CSE_Limit,
          MOP_LOW_Limit,
          MOP_UP_Limit,
          duplexMode,
        ] = item;
        //去空格
        if (!tempBand) {
          break;
        }
        const Band = tempBand.replace(reg, "");
        tempArr.push({
          Band,
          FL,
          FH,
          CSE_Limit,
          duplexMode,
          MOP_LOW_Limit,
          MOP_UP_Limit,
        });
      }
      resultObj[tempName] = tempArr;
    }
    await outputJson(filePath, resultObj);
    return Promise.resolve();
  } catch (error) {
    const msg = `authTypeObj.js 77 ${error}`
    logError(msg)
    return Promise.reject(error);
  }
};
