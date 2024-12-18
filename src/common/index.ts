/*
 * @Author: feifei
 * @Date: 2023-12-15 14:08:57
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:14:15
 * @FilePath: \pxa_signal_analyzer\src\common\index.ts
 * @Description:前后端通用的纯函数,或者部分静态数据
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

export const visaProxyDefaultPort: number = 10089;
export const webAppDefaultPort: number = 10010;
export const visaProxyAppName: string = 'visa_proxy_telec';
export const webAppName: string = 'WebApplication2';
//测试用例
export const testItemList = [
  {
    label: 'Antenna Power',
    value: 'AP',
  },
  {
    label: 'Unwanted Emission Strength Out-band Area',
    value: 'SEM',
  },
  { label: 'Occupied Bandwidth', value: 'OBW' },
  { label: 'Unwanted Emission Strength Spurious Area', value: 'CSE' },
  { label: 'Adjacent Channel Leakage Power', value: 'ACLP' },
  { label: 'Secondary Radiated Emission Strength', value: 'SRES' },
  { label: 'Leakage Power at No-carrier Transmission', value: 'LPNT' },
  { label: 'Intermodulation Characteristic', value: 'IC' },
  { label: 'Frame Length', value: 'FL' },
];
//基站连接名称
export const uxmConnectionName = 'uxmLink';
//lineLoss连接名称
export const uxmLineLossConnectionName = 'uxmLineLossLink';
//MT8000连接名称
export const MT8000ConnectionName = 'MT8000Link';
//频谱连接名称
export const spectrumConnectionName = 'spectrumLink';
export const getIpByVisaAddress = (visaAddress: string) => {
  if (visaAddress) {
    // 定义正则表达式来匹配 IP 地址
    const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
    // 使用正则表达式的 exec 方法来匹配 IP 地址
    const matches = visaAddress.match(ipRegex);
    // 输出匹配到的 IP 地址
    if (matches) {
      return matches[0];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
//OBW结果处理函数
const OBWResultFormat = (result: string | undefined) => {
  try {
    if (result) {
      const rstArr = result.split(',');
      const tempOBW = rstArr[0];
      const tempBW26dB = rstArr[6];
      if (tempOBW && tempBW26dB) {
        const obw = (Number(tempOBW) / 1000000).toFixed(3);
        const BW26dB = (Number(tempBW26dB) / 1000000).toFixed(3);
        return `${obw},${BW26dB}`;
      } else {
        return '';
      }
    } else {
      return '';
    }
  } catch (error) {
    console.log(error);
    return '';
  }
};

//测试结果格式化
export const resultFormatFn = (record) => {
  const { testItem, result, CSE_Limit, BW } = record;
  if (result) {
    // PAR
    if (testItem === 'PAR') {
      return result;
    }
    //OBW
    else if (testItem === 'OBW') {
      return OBWResultFormat(result);
    }
    //CSE
    else if (testItem === 'CSE') {
      const level = Number(result.split(',')[1]);
      return level <= CSE_Limit;
    }
    //BandEdge
    else if (testItem === 'BandEdge') {
      if (result?.length) {
        if (result.length === 1 && result[0] === 0) {
          return true;
        }
        let i = 6;
        let firstRst = result[i];
        //
        if (!firstRst) {
          return false;
        }
        while (true) {
          i += 6;
          let tempRst = result[i];
          if (tempRst === 0) {
            return false;
          } else if (tempRst === undefined) {
            return true;
          }
        }
      } else {
        return '';
      }
    } else {
      return '';
    }
  } else {
    return '';
  }
};

//result判定函数,纯函数,前后端通用
export const verdictHandle = (record: any): boolean => {
  const { result, testItem, BW, CSE_Limit } = record;
  if (result) {
    // PAR
    if (testItem === 'PAR') {
      return Number(result) <= 13;
    }
    //OBW
    else if (testItem === 'OBW') {
      const obw = Number(result.split(',')[0]);
      return obw <= BW;
    }
    //CSE
    else if (testItem === 'CSE') {
      const level = Number(result.split(',')[1]);
      return level <= CSE_Limit;
    }
    //BandEdge
    else if (testItem === 'BandEdge' || testItem === 'BandEdgeIC') {
      if (result?.length) {
        if (result.length === 1 && result[0] === 0) {
          return true;
        }
        let i = 6;
        let firstRst = result[i];
        //
        if (!firstRst) {
          return false;
        }
        while (true) {
          i += 6;
          let tempRst = result[i];
          if (tempRst === 0) {
            return false;
          } else if (tempRst === undefined) {
            return true;
          }
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const FullAbbreviationTable = {
  PAR: 'Peak-Average Ratio',
  OBW: 'Occupied Bandwidth',
  BandEdge: 'Band Edges Compliance',
  BandEdgeIC: 'Band Edges Compliance IC',
  CSE: 'Conducted Spurious Emission',
  MOP: 'Maximum Output Power',
};
