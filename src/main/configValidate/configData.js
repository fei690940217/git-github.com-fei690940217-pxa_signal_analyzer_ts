/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\configValidate\configData.js
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 10:15:18
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
const fsPromises = require("fs").promises;
const fs = require("fs");
const xlsx = require("node-xlsx").default;
const { chunk } = require("lodash");
const path = require("path");
const { mainSendRender } = require("../utils");
const { outputJson, pathExists, readJson } = require("fs-extra");
const { logError } = require("../logger/logLevel");

const { appConfigFilePath } = require("../publicData");
const reg = /\s/g; //去掉空格

//配置文件地址
const configFilePath = path.join(appConfigFilePath, "user/operating bands");
//写入本地
let resultconfigFilePath = path.join(
  appConfigFilePath,
  "app/addProjectConfig.json"
);
//测试用例
const numHandle = (num) => {
  return parseFloat(Number(num).toFixed(2));
};
//fdd表处理函数  downlink uplink   >上下行不相同需分开
const fddSheetHandle = (list, allFilePath) => {
  return new Promise((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(3);
      //用chunk分成6个一组
      const chunkList = chunk(tempList, 6);
      const tempObj = {};
      for (let [
        firstRow,
        secondRow,
        thirdRow,
        fourthRow,
        fifthRow,
        sixthRow,
      ] of chunkList) {
        const BW = firstRow[0];
        //[信道,频谱] 第一位>低 第二位>中 第三位>高
        const lowARFCN = numHandle(fourthRow[4]);
        const lowFreq = numHandle(fourthRow[3]);
        const midARFCN = numHandle(fifthRow[4]);
        const midFreq = numHandle(fifthRow[3]);
        const highARFCN = numHandle(sixthRow[4]);
        const highFreq = numHandle(sixthRow[3]);
        tempObj[BW] = [
          [lowARFCN, lowFreq],
          [midARFCN, midFreq],
          [highARFCN, highFreq],
        ];
      }
      resolve(tempObj);
    } catch (error) {
      logError(`请检查 ${allFilePath} 格式是否正确 ${error}`)
      mainSendRender("showConfigError", `请检查 ${allFilePath} 格式是否正确`);
      resolve({});
    }
  });
};
//tdd表处理函数  downlink == uplink
const tddSheetHandle = (list, allFilePath) => {
  return new Promise((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(3);
      //用chunk分成6个一组
      const chunkList = chunk(tempList, 3);
      const tempObj = {};
      for (let [firstRow, secondRow, thirdRow] of chunkList) {
        const BW = firstRow[0];
        //[信道,频谱] 第一位>低 第二位>中 第三位>高
        const lowARFCN = numHandle(firstRow[4]);
        const lowFreq = numHandle(firstRow[3]);
        const midARFCN = numHandle(secondRow[4]);
        const midFreq = numHandle(secondRow[3]);
        const highARFCN = numHandle(thirdRow[4]);
        const highFreq = numHandle(thirdRow[3]);
        tempObj[BW] = [
          [lowARFCN, lowFreq],
          [midARFCN, midFreq],
          [highARFCN, highFreq],
        ];
      }
      resolve(tempObj);
    } catch (error) {
      logError(`请检查 ${allFilePath} 格式是否正确`)
      mainSendRender("showConfigError", `请检查 ${allFilePath} 格式是否正确`);
      resolve({});
    }
  });
};
//sar表处理函数  downlink == uplink
const sarSheetHandle = (list, allFilePath) => {
  return new Promise((resolve, reject) => {
    try {
      //去掉表头(前三位)
      const tempList = list.slice(3);
      //用chunk分成5个一组
      const chunkList = chunk(tempList, 5);
      const tempObj = {};
      for (let [
        firstRow,
        secondRow,
        thirdRow,
        fourthRow,
        fifthRow,
      ] of chunkList) {
        const BW = firstRow[0];
        //[信道,频谱] 第一位>低 第二位>中 第三位>高
        const lowARFCN = numHandle(firstRow[4]);
        const lowFreq = numHandle(firstRow[3]);
        const lowMidARFCN = numHandle(secondRow[4]);
        const lowMidFreq = numHandle(secondRow[3]);
        const midARFCN = numHandle(thirdRow[4]);
        const midFreq = numHandle(thirdRow[3]);
        const midHighARFCN = numHandle(fourthRow[4]);
        const midHighFreq = numHandle(fourthRow[3]);
        const highARFCN = numHandle(fifthRow[4]);
        const highFreq = numHandle(fifthRow[3]);
        tempObj[BW] = [
          [lowARFCN, lowFreq],
          [midARFCN, midFreq],
          [highARFCN, highFreq],
          [lowMidARFCN, lowMidFreq],
          [midHighARFCN, midHighFreq],
        ];
      }
      resolve(tempObj);
    } catch (error) {
      logError(`请检查 ${allFilePath} 格式是否正确`)
      mainSendRender("showConfigError", `请检查 ${allFilePath} 格式是否正确`);
      resolve({});
    }
  });
};
//判断表是否在BANDList中存在
const isPresentFn = (name, allBandList) => {
  let tempName = name;
  if (name.includes("edge")) {
    tempName = name.replace("edge", "");
  } else if (name.includes("sar")) {
    tempName = name.replace("sar", "");
  }
  const findItem = allBandList.find(({ Band }) => {
    return Band === tempName;
  });
  if (findItem) {
    return true;
  } else {
    return false;
  }
};
const isFDDFn = (name, allBandList) => {
  let tempName = name;
  if (name.includes("edge")) {
    tempName = name.replace("edge", "");
  }
  const findItem = allBandList.find(({ Band }) => {
    return Band === tempName;
  });
  if (findItem.duplexMode === "FDD") {
    return true;
  } else {
    return false;
  }
};
//循环获取单表数据,参数为workbook 例:workSheetsList [{name:'n2',data:[xx,xx]}]
const sheetDataHandle = (workSheetsList, allBandList, filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      let tempObj = {};
      //循环表
      for (let worksheet of workSheetsList) {
        const { name, data } = worksheet;
        const allFilePath = `${filePath} ${name}表`;
        const tempName = name.replace(reg, "");
        //Band是否存在
        const isPresent = isPresentFn(tempName, allBandList);
        let result = {};
        if (isPresent) {
          const isSAR = tempName.includes("sar");
          //SAR单独处理
          if (isSAR) {
            result = await sarSheetHandle(data, allFilePath);
          } else {
            const isFDD = isFDDFn(tempName, allBandList);
            if (isFDD) {
              result = await fddSheetHandle(data, allFilePath);
            } else {
              result = await tddSheetHandle(data, allFilePath);
            }
          }
        } else {
          continue;
        }

        tempObj[tempName] = result;
      }
      resolve(tempObj);
    } catch (error) {
      reject(error);
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
    //读取authTypeObj
    const filePath = path.join(appConfigFilePath, "app/authTypeObj.json");
    const authTypeObj = await readJson(filePath);
    let resultObj = {};
    for (let authTypeItem of ["FCC", "CE", "TELEC"]) {
      const allBandList = authTypeObj[authTypeItem];
      let SCS_OBJ = {};
      //for of bandList
      for (let SCS of ["15", "30", "60"]) {
        SCS_OBJ[SCS] = {};
        const filePath = path.join(
          configFilePath,
          `${authTypeItem}/${SCS}KHz.xlsx`
        );
        //判断文件是否存在
        try {
          await fsPromises.access(filePath);
        } catch (error) {
          //如果文件不存在直接跳过
          continue;
        }
        const workSheetsList = xlsx.parse(filePath);
        const SCSObj = await sheetDataHandle(
          workSheetsList,
          allBandList,
          filePath
        );
        SCS_OBJ[SCS] = SCSObj;
      }
      resultObj[authTypeItem] = SCS_OBJ;
    }
    await outputJson(resultconfigFilePath, resultObj);
  } catch (error) {
    logError(error.toString())
  }
};
