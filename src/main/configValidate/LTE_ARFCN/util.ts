import { logError } from '@src/main/logger/logLevel';
import { LTEARFCNItemType } from '@src/customTypes/main';
const reg = /\s+/g;
export const workbookNameHandle = (sheetName: string | undefined) => {
  if (!sheetName) {
    return null;
  }
  return sheetName.replace(reg, '');
};
export const xlsxDataArrayToObject = (
  result: any[][],
  Band: string,
): LTEARFCNItemType[] => {
  try {
    if (result?.length <= 1) {
      return [];
    }
    //去掉表头
    const newList = result.slice(1);
    const RST: LTEARFCNItemType[] = newList.flatMap((row) => {
      const [level, BW, UL, FreqUp, DL, FreqDown] = row;
      let newLevel = '';
      if (level?.includes('Low')) {
        newLevel = 'Low';
      } else if (level?.includes('Mid')) {
        newLevel = 'Mid';
      } else {
        newLevel = 'High';
      }
      let BWList = [];
      if (BW?.includes('/')) {
        BWList = BW.split('/');
      } else {
        BWList = [BW];
      }
      const list: LTEARFCNItemType[] = BWList.map((BW: string) => {
        const obj = {
          Band,
          level: newLevel,
          BW,
          UL,
          FreqUp,
          DL,
          FreqDown,
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
    const msg = `LTE_ARFCN xlsxDataArrayToObject error: ${error}`;
    logError(msg);
    return [];
  }
};
