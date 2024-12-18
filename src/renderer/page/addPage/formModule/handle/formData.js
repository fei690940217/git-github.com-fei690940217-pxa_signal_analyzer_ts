/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\formModule\handle\formData.js
 * @Author: xxx
 * @Date: 2023-04-03 15:00:16
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 15:03:54
 * @Descripttion:  form表单不同字段数据
 */
import { evaluate } from "mathjs";

//判断公式的正则
const expressionRegex = /[\+\-\*/]/;
//判断变量的正则
const variableRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;
export const testItemList = [
  { label: "Peak-Average Ratio", value: "PAR" },
  { label: "Occupied Bandwidth", value: "OBW" },
  { label: "Conducted Spurious Emission", value: "CSE" },
  { label: "Band Edges Compliance", value: "BandEdge" },
  { label: "Band Edges Compliance IC", value: "BandEdgeIC" },
];
const modulateList = [
  { OFDM: "DFT", modulate: "BPSK" },
  { OFDM: "DFT", modulate: "QPSK" },
  { OFDM: "DFT", modulate: "16QAM" },
  { OFDM: "DFT", modulate: "64QAM" },
  { OFDM: "DFT", modulate: "256QAM" },
  { OFDM: "CP", modulate: "QPSK" },
  { OFDM: "CP", modulate: "16QAM" },
  { OFDM: "CP", modulate: "64QAM" },
  { OFDM: "CP", modulate: "256QAM" },
];
const RBNameList = [
  "Outer_Full_Left",
  "Outer_Full_Right",
  "Edge_1RB_Left",
  "Edge_1RB_Right",
];
const BandEdgeICRBNameListGenerate = () => {
  const tempList = modulateList.flatMap((modulation) => {
    const { OFDM, modulate } = modulation;
    return RBNameList.map((RB) => {
      return {
        OFDM,
        modulate,
        RB,
      };
    });
  });
  //创建id
  return tempList.map((item, index) => {
    item.id = index + 1;
    return item;
  });
};
export const BandEdgeICRBNameList = BandEdgeICRBNameListGenerate();
const BandEdgeRBNameListGenerate = () => {
  const LOW_RB_LIST = ["Outer_Full", "Edge_1RB_Left"];
  const HIGH_RB_LIST = ["Outer_Full", "Edge_1RB_Right"];
  const lowResult = modulateList.flatMap((modulateItem) => {
    return LOW_RB_LIST.map((RB) => {
      return { ...modulateItem, RB, level: "L" };
    });
  });
  const highResult = modulateList.flatMap((modulateItem) => {
    return HIGH_RB_LIST.map((RB) => {
      return { ...modulateItem, RB, level: "H" };
    });
  });
  const result = [...lowResult, ...highResult];
  const tempResult = result.map((item, index) => {
    item.id = index + 1;
    return item;
  });
  return tempResult;
};
export const BandEdgeRBNameList = BandEdgeRBNameListGenerate();

export const NR_BW_LIST = [
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 20, value: 20 },
  { label: 25, value: 25 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 50, value: 50 },
  { label: 60, value: 60 },
  { label: 70, value: 70 },
  { label: 80, value: 80 },
  { label: 90, value: 90 },
  { label: 100, value: 100 },
];
export const LTE_BW_LIST = [
  { label: 1.4, value: 1.4 },
  { label: 3, value: 3 },
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 20, value: 20 },
];

//sup排序
//计算排序的数字
const computeSortNum = (a, b) => {
  const { LTE_Band: LTE_Band_A, Band: Band_A } = a;
  const { LTE_Band: LTE_Band_B, Band: Band_B } = b;
  const LTE_Band_A_Num = Number(LTE_Band_A.substring(1));
  const Band_A_Num = Number(Band_A.split("(")[0].substring(1));
  const LTE_Band_B_Num = Number(LTE_Band_B.substring(1));
  const Band_B_Num = Number(Band_B.split("(")[0].substring(1));
  const LTE_NUM = LTE_Band_A_Num - LTE_Band_B_Num;
  const Band_NUM = Band_A_Num - Band_B_Num;
  if (Band_NUM > 0) {
    return 1;
  } else if (Band_NUM === 0) {
    return LTE_NUM;
  } else {
    return -1;
  }
};
export const resultSortHandle = (list) => {
  return list.map((item) => {
    item.list.sort((a, b) => {
      return computeSortNum(a, b);
    });
    return item;
  });
};

//判断表格数据的类型 数字,计算公式,单变量,无效
export const determineType = (value) => {
  //先判断是不是数字,如果是数字直接返回数字
  if (!isNaN(value)) {
    return "Number";
  } else if (variableRegex.test(value)) {
    return "Variable";
  } else if (expressionRegex.test(value)) {
    return "Expression";
  } else {
    return "Unknown";
  }
};
//本函数需要返回
// {
//   "no": 3,
//   "start": ["FL-BW", "FL-1", "FL"],
//   "stop": ["FL-1", "FL", "FL+BW"],
//   "RBW": [1000, 30, 1000],
//   "VBW": [3000, 90, 3000],
//   "limit": [-13, -13, 40]
// }
//循环处理 start,stop,RBW,VBW   subItem:提供变量使用
export const loopFn = (list, subItem) => {
  return list.map((item) => {
    const type = determineType(item);
    //数字
    if (type === "Number") {
      return item;
    }
    //单变量
    else if (type === "Variable") {
      return subItem[item];
    }

    //计算公式
    else if (type === "Expression") {
      const { FL, FH, BW, DLFreq: CF } = subItem;
      const params = {
        FL,
        FH,
        BW,
        CF,
      };
      const result = Number(evaluate(item, params).toFixed(2));
      return result;
    }
    //无效字符
    else if (type === "Unknown") {
      return "";
    }
  });
};
