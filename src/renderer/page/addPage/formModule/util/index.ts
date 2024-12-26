/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\util\index.ts
 * @Author: xxx
 * @Date: 2023-04-06 14:36:21
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-25 15:49:19
 * @Descripttion: 测试数据生成
 */
import { cloneDeep } from 'lodash';
import {
  AddFormValueType,
  ResultItemType,
  TestItemType,
} from '@src/customTypes/renderer';
import { type Key } from 'react';
//全部的band列表,用于排序
import BandEdgeICHandle from './BandEdgeICHandle';
import BandEdgeHandle from './BandEdgeHandle';

import supResultGenerate from './supResultGenerate';
import subsHandle from './subsHandle';
const { ipcRenderer } = window.myApi;

//cse需要插入下面的参数
//  "n7": [
//         {
//             "rangeStart": "30",
//             "rangeStop": "20000",
//             "RBW": "1000",
//             "VBW": "3000",
//             "CSE_Limit": "-25",
//             "atten": "14",
//             "segmentNumber": 1
//         },
//         {
//             "rangeStart": "20000",
//             "rangeStop": "26000",
//             "RBW": "1000",
//             "VBW": "3000",
//             "CSE_Limit": "-25",
//             "atten": "14",
//             "segmentNumber": 2
//         }
//     ],
const CSENewListHandle = async (supList, isGate) => {
  try {
    const CSELimit = await ipcRenderer.invoke(
      'getJsonFileByFilePath',
      'app/CSELimit.json',
    );
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
const AbnormalHandle = async (
  result: ResultItemType[],
  isGate: boolean,
  testItems: TestItemType,
) => {
  try {
    const RST = cloneDeep(result);
    let RESULT = null;
    if (testItems === 'CSE') {
      RESULT = await CSENewListHandle(RST, isGate);
    } else if (testItems === 'BandEdge') {
      RESULT = await BandEdgeHandle(RST, isGate);
    } else if (testItems === 'BandEdgeIC') {
      RESULT = await BandEdgeICHandle(RST);
    }
    return Promise.resolve(RESULT);
  } catch (error) {
    return Promise.reject(error);
  }
};

//对结果添加id
const resultIdHandle = (supResult) => {
  const RST = supResult.map((item, index: number) => {
    item.id = index + 1;
    return item;
  });
  return RST;
};

export default (formValue: AddFormValueType, RBSelectedRowKeys: Key[]) => {
  return new Promise<ResultItemType[]>(async (resolve, reject) => {
    try {
      let RST = null;
      const { isGate, testItems } = formValue;
      //父级数据生成
      const supResult = await supResultGenerate(formValue);
      //子级数据生成
      RST = await subsHandle(supResult, RBSelectedRowKeys, testItems);

      //对CSE,BandEdge,BandEdgeIC进行特殊处理
      const arr = ['BandEdge', 'CSE', 'BandEdgeIC'];
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
