/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\formModule\util\index.js
 * @Author: xxx
 * @Date: 2023-04-06 14:36:21
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 15:06:05
 * @Descripttion: 测试数据生成
 */
import { cloneDeep, isNumber } from "lodash";
import RBTableObj from './RBTableObj'
import { logError } from '@/utils/logLevel.js'

//全部的band列表,用于排序
import {
  BandEdgeICRBNameList,
  BandEdgeRBNameList,
  loopFn,
} from "./formData";
import BandEdgeICHandle from "./BandEdgeICHandle";
import supResultGenerate from './supResultGenerate'
const { ipcRenderer } = window.myApi;


//子级数据生成
const subsHandle = async (list, RBList, formValue) => {
  try {
    const { networkMode, isGate, testItems } = formValue;
    const supList = list
    //获取新增项目的配置文件
    //LTE_Band_List
    const addProjectRbConfig = await ipcRenderer.invoke(
      "getJsonFileByFilePath",
      "app/addProjectRbConfig.json"
    );
    const RESULT = [];
    for (let supItem of supList) {
      let rbList = cloneDeep(RBList)
      const { level, Band } = supItem;
      if (testItems === "BandEdge") {
        if (Band === "n48") {
          rbList = [
            {
              OFDM: "DFT",
              modulate: "BPSK",
              RB: "Outer_Full",
              level: "L",
              id: 1,
            },
            {
              OFDM: "DFT",
              modulate: "QPSK",
              RB: "Outer_Full",
              level: "L",
              id: 3,
            },
          ];
        } else {
          rbList = rbList.filter(({ level: rbLevel }) => {
            const tempLevel = rbLevel === "L" ? "Low" : "High";
            return tempLevel === level;
          });
        }
      }
      for (let subItem of rbList) {
        const tempSubItem = cloneDeep(subItem);
        const { OFDM, RB, modulate } = tempSubItem;
        //RB需要做特殊处理
        let RBKey = tempSubItem.RB;
        if (testItems === "BandEdgeIC") {
          if (RBKey.includes("Full")) {
            RBKey = "Outer_Full";
          }
        }
        let RBNum = "";
        let RBStart = "";
        let fullRBNum = "";
        let fullRBStart = "";
        let testItemKey = testItems;
        if (testItems === "BandEdgeIC") {
          testItemKey = "BandEdge";
        }
        try {
          RBNum =
            addProjectRbConfig[testItemKey][supItem.SCS][supItem.BW][OFDM][
            RBKey
            ]["num"];
          RBStart =
            addProjectRbConfig[testItemKey][supItem.SCS][supItem.BW][OFDM][
            RBKey
            ]["start"];
          fullRBNum =
            addProjectRbConfig[testItemKey][supItem.SCS][supItem.BW][OFDM][
            "Outer_Full"
            ]["num"];
          fullRBStart =
            addProjectRbConfig[testItemKey][supItem.SCS][supItem.BW][OFDM][
            "Outer_Full"
            ]["start"];
        } catch (error) {
          return Promise.reject(
            `请检查RB配置表是否存在 ${testItems} ${supItem.SCS}KHz ${supItem.BW}MHz ${OFDM} ${RB}`
          );
        }

        RESULT.push({
          ...supItem,
          OFDM,
          modulate,
          RB,
          RBNum,
          RBStart,
          fullRBNum,
          fullRBStart,
          result: "",
        });
      }
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};
//根据RBSelectedRowKeys 与addProjectRbConfig 生成RB列表  参数为测试用例 例如 PAR
const RBListGenerate = async (RBSelectedRowKeys, testItem) => {
  try {
    const RB_LIST = RBTableObj[testItem];
    const rbList = RB_LIST.filter((rbItem) => {
      return RBSelectedRowKeys.includes(rbItem.id);
    });
    return Promise.resolve(rbList);
  } catch (error) {
    return Promise.reject(error);
  }
};

const findItemHandle = (findItem, subItem) => {
  const {
    start: startList,
    stop: stopList,
    RBW: RBW_LIST,
    VBW: VBW_LIST,
    no,
    limit,
    sweepTime,
    sweepPoint,
  } = findItem;
  return {
    start: loopFn(startList, subItem),
    stop: loopFn(stopList, subItem),
    RBW: loopFn(RBW_LIST, subItem),
    VBW: loopFn(VBW_LIST, subItem),
    no,
    limit,
    sweepTime,
    sweepPoint,
  };
};

const findEmissionItem = async (emissionList, BW, RB, level, Band) => {
  try {
    const tempRB = RB === "Outer_Full" ? "FUll" : 1;
    const tempLevel = level[0]; //L,M,H
    const tempBW = String(BW);
    const findItem = emissionList.find((emissionItem) => {
      const BW_FLAG =
        emissionItem.BW === "all" ||
        emissionItem.BW == tempBW ||
        `${emissionItem.BW}`.includes(tempBW);
      const RBFlag = emissionItem.RB == tempRB;
      const levelFlag = emissionItem.level === tempLevel;
      return RBFlag && BW_FLAG && levelFlag;
    });
    if (findItem) {
      return Promise.resolve(findItem);
    } else {
      return Promise.reject(
        `请检查emissionLimit配置表 ${Band} RB<${tempRB}> BW<${BW}> level<${level}> 是否存在 `
      );
    }
  } catch (error) {
    const msg = `请检查emissionLimit配置表 ${Band} RB<${RB}> BW<${BW}> level<${level}> 是否存在 `
    logError(msg)
    return Promise.reject(msg)
  }
};
const BandEdgeHandle = async (supList, isGate) => {
  try {
    const emissionLimit = await ipcRenderer.invoke(
      "getJsonFileByFilePath",
      "app/emissionLimit.json"
    );
    const emissionLimitGate = await ipcRenderer.invoke(
      "getJsonFileByFilePath",
      "app/emissionLimitGate.json"
    );
    const RESULT = [];
    for (const supItem of supList) {
      //通过一下四个参数,找到匹配的emissionLimit配置
      const { Band, BW, RB, level, duplexMode } = supItem;
      let emissionList = emissionLimit[Band];
      if (duplexMode === "TDD" && isGate) {
        emissionList = emissionLimitGate[Band];
      }
      const findItem = await findEmissionItem(
        emissionList,
        BW,
        RB,
        level,
        Band
      );
      let TEMP_OBJ = findItemHandle(findItem, supItem);
      //对findItem进行处理 公式计算
      const tempSubItem = {
        ...supItem,
        ...TEMP_OBJ,
        isGate,
      };
      RESULT.push(tempSubItem);
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};

const CSENewListHandle = async (supList, isGate) => {
  try {
    const CSELimit = await ipcRenderer.invoke("getJsonFileByFilePath", "app/CSELimit.json");
    const newSupList = supList.flatMap((supItem) => {
      const { Band } = supItem;
      const CSELimitItemList = CSELimit[Band];
      return CSELimitItemList.map((cseLimitItem) => {
        return { ...supItem, ...cseLimitItem, isGate };
      });
    });
    return Promise.resolve(newSupList);
  } catch (error) {
    return Promise.reject(error);
  }
};
//特殊处理了,CSE需分段,BandEdge特殊参数添加
const AbnormalHandle = async (result, isGate, testItems) => {
  try {
    const RST = cloneDeep(result);
    let RESULT = null;
    if (testItems === "CSE") {
      RESULT = await CSENewListHandle(RST, isGate);
    } else if (testItems === "BandEdge") {
      RESULT = await BandEdgeHandle(RST, isGate);
    } else if (testItems === "BandEdgeIC") {
      RESULT = await BandEdgeICHandle(RST);
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};

//对结果添加id
const resultIdHandle = (supResult) => {
  const RST = supResult.map((item, index) => {
    item.id = index + 1;
    return item
  });
  return RST;
};


export default (formValue, RBSelectedRowKeys) => {
  return new Promise(async (resolve, reject) => {
    try {
      let RST = null;
      const { networkMode, isGate, testItems } = formValue;
      //第一步根据RB idList生成全值list
      const RBList = await RBListGenerate(RBSelectedRowKeys, testItems);
      //父级数据生成
      const supResult = await supResultGenerate(formValue);
      //子级数据生成
      RST = await subsHandle(supResult, RBList, formValue);

      //对CSE,BandEdge,BandEdgeIC进行特殊处理
      const arr = ['BandEdge', 'CSE', 'BandEdgeIC']
      if (arr.includes(testItems)) {
        RST = await AbnormalHandle(RST, isGate, testItems);
      }
      //对数据添加Id
      const result = resultIdHandle(RST);
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
