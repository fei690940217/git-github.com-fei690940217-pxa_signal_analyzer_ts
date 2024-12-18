/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\configValidate\LTE_ARFCN.js
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 10:19:23
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
const fsPromises = require("fs").promises;
const { outputJson, pathExists, readJson } = require("fs-extra");

const xlsx = require("node-xlsx").default;
const path = require("path");
const reg = /[\t\r\f\n\s]*/g;
const { appConfigFilePath } = require("../publicData");
const { logError } = require("../logger/logLevel");

//配置文件地址
const configFilePath = path.join(
  appConfigFilePath,
  "user/operating bands/LTE_ARFCN.xlsx"
);
//解析后写入本地
const resultconfigFilePath = path.join(
  appConfigFilePath,
  "app/LTE_ARFCN.json"
);
const LTE_Band_List_File_Path = path.join(
  appConfigFilePath,
  "app/LTE_Band_List.json"
);
//测试用例
//fdd表处理函数  downlink uplink   >上下行不相同需分开
const fddSheetHandle = (list) => {
  return new Promise((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(1);
      //分组 [Low,Mid,High]
      const chunkList = { Low: [], Mid: [], High: [] };
      //把第一位补足
      const arr = tempList.map((item, index) => {
        if (!item[0]) {
          item[0] = tempList[index - 1][0];
        }
        return item;
      });
      arr.forEach((item, index) => {
        if (item[0].includes("Low")) {
          chunkList["Low"].push(item);
        } else if (item[0].includes("Mid")) {
          chunkList["Mid"].push(item);
        } else if (item[0].includes("High")) {
          chunkList["High"].push(item);
        }
      });
      const tempObj = {};
      //
      for (let [key, itemList] of Object.entries(chunkList)) {
        //AFRCN取 DL(4)  freq取UL(3) BW(1)
        tempObj[key] = itemList.map((item) => {
          return { BW: item[1], AFRCN: item[4], FREQ: item[3] };
        });
      }
      resolve(tempObj);
    } catch (error) {
      logError(error.toString())
      resolve({});
    }
  });
};
//tdd表处理函数  downlink == uplink
const tddSheetHandle = (list) => {
  return new Promise((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(1);
      //分组 [Low,Mid,High]
      const chunkList = { Low: [], Mid: [], High: [] };
      //把第一位补足
      const arr = tempList.map((item, index) => {
        if (!item[0]) {
          item[0] = tempList[index - 1][0];
        }
        return item;
      });
      arr.forEach((item, index) => {
        if (item[0].includes("Low")) {
          chunkList["Low"].push(item);
        } else if (item[0].includes("Mid")) {
          chunkList["Mid"].push(item);
        } else if (item[0].includes("High")) {
          chunkList["High"].push(item);
        }
      });
      const tempObj = {};
      //
      for (let [key, itemList] of Object.entries(chunkList)) {
        // BW(1)  AFRCN取 DL(2)  freq取UL(3)
        tempObj[key] = itemList.map((item) => {
          return { BW: item[1], AFRCN: item[2], FREQ: item[3] };
        });
      }
      resolve(tempObj);
    } catch (error) {
      logError(error.toString())
      resolve({});
    }
  });
};

module.exports = async (isRefresh) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(resultconfigFilePath)
      if (flag) {
        return Promise.resolve()
      }
    }
    let resultObj = {};
    //判断文件是否存在
    await fsPromises.access(configFilePath);
    const workSheetsList = xlsx.parse(configFilePath);

    const LTE_Band_List = await readJson(LTE_Band_List_File_Path);
    //循环表
    for (let worksheet of workSheetsList) {
      const { name, data } = worksheet;
      let isFDD = true;
      const Band = name.replace(reg, "");
      //在LTE_Band_List找到对应的Band,判断是不是FDD
      const findBandItem = LTE_Band_List.find((item) => {
        return item.Band === Band;
      });
      if (findBandItem) {
        isFDD = findBandItem?.["duplexMode"] === "FDD";
      } else {
        continue;
      }
      let result = {};
      if (isFDD) {
        result = await fddSheetHandle(data);
      } else {
        result = await tddSheetHandle(data);
      }
      resultObj[Band] = result;
    }
    await outputJson(resultconfigFilePath, resultObj);
  } catch (error) {
    logError(error.toString())
  }
};
