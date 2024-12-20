/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\util\formData.ts
 * @Author: xxx
 * @Date: 2023-04-03 15:00:16
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 10:48:58
 * @Descripttion:  form表单不同字段数据
 */
import { evaluate } from 'mathjs';

//判断公式的正则
const expressionRegex = /[\+\-\*/]/;
//判断变量的正则
const variableRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;

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

//判断表格数据的类型 数字,计算公式,单变量,无效
export const determineType = (value: any) => {
  //先判断是不是数字,如果是数字直接返回数字
  if (!isNaN(value)) {
    return 'Number';
  } else if (variableRegex.test(value)) {
    return 'Variable';
  } else if (expressionRegex.test(value)) {
    return 'Expression';
  } else {
    return 'Unknown';
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
    if (type === 'Number') {
      return item;
    }
    //单变量
    else if (type === 'Variable') {
      return subItem[item];
    }

    //计算公式
    else if (type === 'Expression') {
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
    else if (type === 'Unknown') {
      return '';
    }
  });
};
