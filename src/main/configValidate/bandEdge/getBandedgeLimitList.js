/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\configValidate\bandEdge\getBandedgeLimitList.js
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 09:49:22
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
const XLSX = require("xlsx");
const { logError } = require("../../logger/logLevel.js");

//配置文件地址
//n2&n25  对表明进行处理list化
const getBandList = (name) => {
  try {
    if (name) {
      return name.split("&");
    } else {
      return [];
    }
  } catch (error) {
    const msg = `getBandedgeLimitList.js 23行 错误:${error}`
    logError(msg)
    return [];
  }
};
//按照RB level,BW相同的原则分组
const groupByRBAndBWAndLevel = (list, sheetName) => {
  const tempObj = list.reduce((groups, item) => {
    const { RB, BW, level } = item;
    const key = `${RB}-${BW}-${level}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {});
  const resultArr = Object.values(tempObj).map((itemList) => {
    const tempItemList = itemList.sort((a, b) => a.no - b.no);
    //找到最大的no
    const noList = itemList.map((item) => item.no);
    const maxNo = Math.max(...noList);
    const start = tempItemList.map((item) => item.start);
    const stop = tempItemList.map((item) => item.stop);
    const RBW = tempItemList.map((item) => item.RBW);
    const VBW = tempItemList.map((item) => item.VBW);
    const limit = tempItemList.map((item) => item.limit);
    const sweepPoint = tempItemList.map((item) => item.sweepPoint);
    const sweepTime = tempItemList.map((item) => item.sweepTime);
    return {
      RB: tempItemList[0].RB,
      BW: tempItemList[0].BW,
      level: tempItemList[0].level,
      no: maxNo,
      start,
      stop,
      RBW,
      VBW,
      limit,
      sweepPoint,
      sweepTime,
    };
  });
  //处理name,&
  const RESULT = {};
  const bandList = getBandList(sheetName);
  bandList.forEach((item) => {
    RESULT[item] = resultArr;
  });
  return RESULT;
};

module.exports = async (configFilePath) => {
  try {
    let RESULT = {};
    const header = [
      "RB",
      "BW",
      "level",
      "no",
      "start",
      "stop",
      "RBW",
      "VBW",
      "limit",
      "sweepTime",
      "sweepPoint",
    ];
    const wb = XLSX.readFile(configFilePath);
    //判断文件是否存在
    const { Sheets, Workbook } = wb;
    const { Sheets: sheetList } = Workbook;
    for (const sheetItem of sheetList) {
      const { name, Hidden } = sheetItem;
      if (Hidden === 1) {
        continue;
      }
      const sheet = Sheets[name];
      const json = XLSX.utils.sheet_to_json(sheet, {
        range: 1,
        header,
        defval: "",
        raw: false, // 禁用原始文本模式
        // blankrows: false, // 不忽略空行
      });
      const newJson = groupByRBAndBWAndLevel(json, name);
      Object.assign(RESULT, newJson);
    }
    return Promise.resolve(RESULT);
    // await jsonfile.writeFile(resultconfigFilePath, RESULT);
  } catch (error) {
    const msg = `getBandedgeLimitList.js 113行 错误:${error}`
    logError(msg)
    return Promise.reject(error);
  }
};
