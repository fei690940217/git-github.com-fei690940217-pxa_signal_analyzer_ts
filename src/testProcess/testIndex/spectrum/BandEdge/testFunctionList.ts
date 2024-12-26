/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\spectrum\BandEdge\testFunctionList.ts
 * @Author: xxx
 * @Date: 2023-05-08 13:27:31
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 17:46:55
 * @Descripttion: 测试函数集合
 */
import SharedParameters from '@src/testProcess/globals';
import { nanoid } from 'nanoid';
import { orderBy } from 'lodash';
import {
  publicWriteFn,
  CABLE_LOSS as public_cable_loss,
} from '../testFunctionList';
import { logInfo, logError } from '@src/testProcess/utils/logLevel';
import { LineLossTableList } from '@src/customTypes/testprocess';

//OBW频谱结果转换
//频谱返回格式   3.000000000E+00,1000000000E+00,1.000000000E+00, 2.553466667E+09, 1.903601837E+01,3.000000000E+01,1.000000000E+00,2.000000000E+00,3.000000000E+00,2.573406667E+09,3.000000000E+00,3.000000000E+00,1.000000000E+0,1.000000000E+0,1.000000000E+0,1.000000000E+0,1.000000000E+0,1.000000000E+0,0.000000000E+0
//需转换为MHz  1MHz = 1000000 Hz
export const resultNumHandle = (rst: string) => {
  try {
    if (rst) {
      const tempRst = rst.split(',').map((item) => Number(item));
      return tempRst;
    } else {
      return [];
    }
  } catch (error) {
    logError(error?.toString() || 'bandedge频谱结果转换失败');
    return [];
  }
};
const dutyCycleCompute = (
  lineLoss: number | null,
  dutyCycle: number | null,
) => {
  if (lineLoss && dutyCycle) {
    const num = 10 * Math.log10(100 / dutyCycle) + lineLoss;
    return num;
  } else {
    return 0;
  }
};
//频谱线损
export const CABLE_LOSS = async (DLFreq: number, isFDD: boolean) => {
  if (isFDD) {
    return public_cable_loss(DLFreq);
  } else {
    let num = '';
    const spectrumLineLoss: LineLossTableList =
      SharedParameters.get('spectrumLineLoss');
    //占空比
    const { dutyCycle } = SharedParameters.get('spectrumConfig');
    const filterSpectrumLineLoss = spectrumLineLoss.filter((item) => {
      return item.frequency !== DLFreq;
    });
    const id = nanoid(8);
    const self = {
      id,
      frequency: DLFreq,
      lineLoss: null,
    };
    filterSpectrumLineLoss.push(self);
    //排序
    const orderSpectrumLineLoss = orderBy(
      filterSpectrumLineLoss,
      ['frequency'],
      ['asc'],
    );
    const findIndex = orderSpectrumLineLoss.findIndex((item) => {
      return item.id === id;
    });
    const prevItem = orderSpectrumLineLoss[findIndex - 1];
    const nextItem = orderSpectrumLineLoss[findIndex + 1];
    //公式(DLFreq-prevItem.frequency)/(nextItem.frequency-prevItem.frequency)*(nextItem.lineLoss-prevItem.lineLoss)+prevItem.lineLoss
    if (prevItem?.id && nextItem?.id) {
      //如果占空比有值
      if (dutyCycle) {
        const a = DLFreq - (prevItem.frequency || 0);
        const b = (nextItem.frequency || 0) - (prevItem.frequency || 0);
        const c =
          dutyCycleCompute(nextItem.lineLoss, dutyCycle) -
          dutyCycleCompute(prevItem.lineLoss, dutyCycle);
        const d = dutyCycleCompute(prevItem.lineLoss, dutyCycle);
        const value = (a / b) * c + d;
        num = value.toFixed(2);
      }
      //如果 用户没有设置占空比
      else {
        const a = DLFreq - (prevItem.frequency || 0);
        const b = (nextItem.frequency || 0) - (prevItem.frequency || 0);
        const c = (nextItem.lineLoss || 0) - (prevItem.lineLoss || 0);
        const d = prevItem.lineLoss || 0;
        const value = (a / b) * c + d;
        num = value.toFixed(2);
      }
    } else {
      num = '5';
    }
    const instructValue = `DISPlay:WINDow:TRACe:Y:SCALe:RLEVel:offset ${num}`;
    return await publicWriteFn('设置频谱线损', instructValue);
  }
};

export const getRepeatString = (str: string, num: number) => {
  return Array(num).fill(str).join(',');
};
