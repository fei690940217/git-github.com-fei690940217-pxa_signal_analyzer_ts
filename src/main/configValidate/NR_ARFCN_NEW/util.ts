/*
 * @Author: feifei
 * @Date: 2025-01-10 17:22:23
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 18:01:20
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\NR_ARFCN_NEW\util.ts
 * @Description:
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
import { logError } from '@src/main/logger/logLevel';
import XLSX from 'xlsx';
import { type Range } from 'xlsx';
import { RBConfigItem } from '@src/customTypes/main';
import { OFDMType } from '@src/customTypes';
const reg = /\s/g; //去掉空格
export const workbookNameHandle = (sheetName: string | undefined) => {
  if (!sheetName) {
    return null;
  }
  const tempName = sheetName.replace(reg, '');
  if (tempName) {
    return tempName;
  } else {
    return null;
  }
};

const header = ['BW', 'Link', 'Level', 'Freq', 'ARFCN'];
export const xlsxDataArrayToObject = (
  result: any[][],
  filterRow: number,
  SCS: number,
  testItem: string,
): RBConfigItem[] => {
  try {
    if (result?.length <= 1) {
      return [];
    }
    //先去掉无用数据
    const newList = result.slice(filterRow);
    //找到表头
    const tempHeaderRow = newList.shift();
    //去一下空格,保险
    //headerrow去掉前两位
    const tempHeaderRow1 = tempHeaderRow?.slice(2);
    const headerRow = tempHeaderRow1?.map((item, index) => {
      return item.replace(/\s+/g, '');
    });
    const RST: RBConfigItem[] = newList.flatMap((row) => {
      const BW = row[0];
      const tempOFDM = row[1];
      const OFDM: OFDMType = tempOFDM?.includes('DFT') ? 'DFT' : 'CP';

      const list = headerRow?.map((headerItem, headerIndex) => {
        //去一下空格
        const RBStr = row[headerIndex + 2]?.replace(/\s+/g, '');
        let num = null;
        let start = null;
        if (RBStr) {
          const RBArr = RBStr.split('/');
          const RBN = RBArr[0];
          const RBS = RBArr[1];
          if (RBN) {
            num = RBN;
          }
          if (RBS) {
            start = RBS;
          }
        }
        const obj: RBConfigItem = {
          testItem,
          SCS,
          BW,
          OFDM,
          RB: headerItem,
          num,
          start,
        };
        return obj;
      });
      if (list && list?.length > 0) {
        return list;
      } else {
        return [];
      }
    });
    if (RST) {
      return RST;
    } else {
      return [];
    }
  } catch (error) {
    console.error(error);
    logError(
      error?.toString() + 'mergeCellDataFill 33' + 'mergeCellDataFill 33',
    );
    return [];
  }
};
