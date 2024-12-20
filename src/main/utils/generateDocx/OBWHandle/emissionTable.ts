/*
 * @Author: feifei
 * @Date: 2023-06-20 14:55:19
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:42:57
 * @FilePath: \pxa_signal_analyzer\src\main\utils\generateDocx\OBWHandle\emissionTable.ts
 * @Description:筛选最大OBW列的 OBW值
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import path from 'path';
import ExcelJS from 'exceljs';
import emissionExcel from './emissionExcel';
const headerArr = [
  ['BandWidth(MHz)', 'Modulation', '99% BW (MHz)', 'Emission Designator'],
];
//对数据按照Band 分组
const bandGroupHandle = (list, isLTE) => {
  return new Promise((resolve, reject) => {
    try {
      const groupedData = {};
      // 遍历每个数据对象
      list.forEach((item) => {
        let groupKey = '';
        if (isLTE) {
          if (Boolean(item.LTE_Band)) {
            groupKey = `${item.LTE_Band}_${item.Band}`;
          } else {
            groupKey = item.Band;
          }
        } else {
          groupKey = item.Band;
        }
        // 如果分组键不存在，则创建一个数组来存储对应的数据
        if (!groupedData[groupKey]) {
          groupedData[groupKey] = [];
        }
        // 将数据添加到对应的分组中
        groupedData[groupKey].push(item);
      });
      const rst = Object.entries(groupedData).map(([label, list]) => {
        return { label, list };
      });
      resolve(rst);
    } catch (error) {
      reject(error);
    }
  });
};
const transformRstFn = (rst, modulate) => {
  let suffix = 'W7D';
  if (modulate.includes('BPSK') || modulate.includes('QPSK')) {
    suffix = 'G7D';
  }
  if (rst) {
    if (Number.isInteger(rst)) {
      //整数
      if (Number(rst) < 10) {
        return `${rst}M00${suffix}`;
      } else {
        return `${rst}M0${suffix}`;
      }
    } else {
      let str = String(rst);
      const arr = str.split('.');
      const firstStr = arr[0];
      const secondStr = arr[1];
      //整数部分小于10
      if (Number(firstStr) < 10) {
        if (secondStr.length === 1) {
          return `${firstStr}M${secondStr}0${suffix}`;
        } else if (secondStr.length === 2) {
          return `${firstStr}M${secondStr}${suffix}`;
        } else {
          const arr = secondStr.split('');
          let firstNum = Number(arr[0]);
          let secondNum = Number(arr[1]);
          let thirdNum = Number(arr[2]);

          if (Number(thirdNum) > 4) {
            secondNum += 1;
            if (secondNum === 10) {
              firstNum += 1;
              if (firstNum === 10) {
                return `${Number(firstStr) + 1}M00${suffix}`;
              } else {
                return `${firstStr}M${firstNum}0${suffix}`;
              }
            } else {
              return `${firstStr}M${firstNum}${secondNum}${suffix}`;
            }
          } else {
            return `${firstStr}M${firstNum}${secondNum}${suffix}`;
          }
        }
      } else if (Number(firstStr) > 10 && Number(firstStr) < 100) {
        if (secondStr.length === 1) {
          return `${firstStr}M${secondStr}${suffix}`;
        } else {
          const arr = secondStr.split('');
          let firstNum = Number(arr[0]);
          let secondNum = Number(arr[1]);
          let thirdNum = Number(arr[2]) || 0;
          if (Number(thirdNum) > 4) {
            secondNum += 1;
          }
          if (secondNum >= 5) {
            firstNum += 1;
          }
          if (firstNum === 10) {
            return `${Number(firstStr) + 1}M0${suffix}`;
          } else {
            return `${firstStr}M${firstNum}${suffix}`;
          }
        }
      } else {
        return `/`;
      }
      // return `${arr[0]}M${rstStr}${suffix}`;
    }
  } else {
    return '/';
  }
};
//处理modulate  'DFT_QPSK' 'CP_Q256'
const modulateHandle = (modulate) => {
  if (modulate.includes('DFT')) {
    if (modulate.includes('BPSK')) {
      return 'DFT-s-OFDM PI/2 BPSK';
    } else {
      return modulate.replace('DFT_', 'DFT-s-OFDM ');
    }
  } else {
    return modulate.replace('CP_', 'CP-OFDM ');
  }
};
//生成每一组Band的数据
const bandExcelListGenerate = (list, modulateList, BWList) => {
  const result = [];
  for (let bw of BWList) {
    for (let modulate of modulateList) {
      //在list中找到BW与modulate一直的选项,其中肯定包括Low,Mid,High
      const filterList = list.filter((item) => {
        const modulationFlag = `${item.OFDM}_${item.modulate}` === modulate;
        return item.BW === bw && modulationFlag;
      });
      //过滤过后找到
      const resultList = filterList.map((item) => {
        if (item.result) {
          return Number(item.result.split(',')[0]);
        } else {
          return 0;
        }
      });
      //找到最大的结果
      const MAX_RST = Math.max.apply(null, resultList);
      const transformRST = transformRstFn(MAX_RST, modulate);
      const tempModulate = modulateHandle(modulate);
      const arr = [bw, tempModulate, MAX_RST, transformRST];
      result.push(arr);
    }
  }
  return result;
};
const computedMergeAddress = (data) => {
  const mergeCells = [];
  let currentName = data[0][0];
  let startRow = 0;

  for (let row = 1; row < data.length; row++) {
    const name = data[row][0];

    if (name !== currentName) {
      // 当前名称与前一个名称不同，结束上一个合并单元格
      const endRow = row - 1;
      if (startRow !== endRow) {
        mergeCells.push([startRow + 1, 1, endRow + 1, 1]); // 合并第一列
      }

      // 更新当前名称和起始行
      currentName = name;
      startRow = row;
    }
    // 处理最后一行
    if (row === data.length - 1) {
      const endRow = row;
      if (startRow !== endRow) {
        mergeCells.push([startRow + 1, 1, endRow + 1, 1]); // 合并第一列
      }
    }
  }

  return mergeCells;
};
export default (list, fileName, baseURL) => {
  return new Promise(async (resolve, reject) => {
    try {
      let RESULT = [];
      const isLTE = list[0]['networkMode'] === 'NSA';
      const groupList = await bandGroupHandle(list, isLTE);
      for (let groupItem of groupList) {
        const { label, list } = groupItem;
        //找出调制list
        let tempModulateList = [];
        let tempBWList = [];
        list.forEach((item) => {
          const { modulate, BW, OFDM } = item;
          tempModulateList.push(`${OFDM}_${modulate}`);
          tempBWList.push(BW);
        });
        //去重
        const modulateList = [...new Set(tempModulateList)];
        const BWList = [...new Set(tempBWList)];
        const excelList = bandExcelListGenerate(list, modulateList, BWList);
        const labelList = [[label, 'headerColumn']];
        RESULT = RESULT.concat(labelList, headerArr, excelList);
      }
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('sheet1');
      worksheet.addRows(RESULT);
      //计算合并单元格地址
      const mergeList = computedMergeAddress(RESULT);
      emissionExcel(worksheet, mergeList);

      // 保存工作簿为Excel文件
      const FilePath = path.join(baseURL, `${fileName}.xlsx`);
      await workbook.xlsx.writeFile(FilePath);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
