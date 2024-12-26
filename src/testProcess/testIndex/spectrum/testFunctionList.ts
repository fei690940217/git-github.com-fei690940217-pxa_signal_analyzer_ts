/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\spectrum\testFunctionList.ts
 * @Author: xxx
 * @Date: 2023-05-08 13:27:31
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 16:45:14
 * @Descripttion: 测试函数集合
 */
import { pinpuConnectionName } from '@src/common';
import path from 'path';
import { nanoid } from 'nanoid';
import { orderBy } from 'lodash';
import SharedParameters from '@src/testProcess/globals';
import { appConfigFilePath } from '@src/main/publicData';
import {
  query_fn,
  write_fn,
  get_screen_capture,
  set_timeout,
} from '@src/testProcess/api';
import { delayTime } from '@src/testProcess/utils';

import { LineLossTableList } from '@src/customTypes/testprocess';
//获取图片路径
export const getImgPath = (id: number) => {
  const projectName = SharedParameters.get('projectName');
  const subProjectName = SharedParameters.get('subProjectName');
  return path.join(
    appConfigFilePath,
    'user/project',
    projectName,
    subProjectName,
    'img',
    `${id}.png`,
  );
};
//公用测试函数
//参数 指令名称,指令值
export const publicWriteFn = async (
  instructName: string,
  instructValue: string,
  timeout?: number,
) => {
  try {
    const params = {
      instr_name: pinpuConnectionName,
      command: instructValue,
      instructName,
    };
    let config = {};
    if (timeout) {
      config = {
        timeout,
      };
    }
    await write_fn(params, config);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export const publicQueryFn = (
  instructName: string,
  command: string,
  timeout?: number,
) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      const params = {
        instr_name: pinpuConnectionName,
        command,
        instructName,
      };
      let config = {};
      if (timeout) {
        config = { timeout };
      }
      const rst = await query_fn(params);
      resolve(rst);
    } catch (error) {
      reject(error);
    }
  });
};

//频谱线损
export const CABLE_LOSS = async (DLFreq: number) => {
  let num = 0;
  //线损
  const spectrumLineLoss: LineLossTableList =
    SharedParameters.get('spectrumLineLoss');
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
    const a = DLFreq - (prevItem.frequency || 0);
    const b = Number(nextItem.frequency) - Number(prevItem.frequency);
    const c = Number(nextItem.lineLoss) - Number(prevItem.lineLoss);
    const d = prevItem.lineLoss;
    const value = (a / b) * c + Number(d);
    num = Number(value.toFixed(2));
  } else {
    num = 5;
  }
  const instructValue = `DISPlay:WINDow:TRACe:Y:SCALe:RLEVel:offset ${num}`;
  return await publicWriteFn('设置频谱线损', instructValue);
};

//POW:ATT {pow_att}
export const POW_ATT = () => {
  const spectrumConfig = SharedParameters.get('spectrumConfig');
  const value = spectrumConfig.POWATT;
  const instructValue = `POW:ATT ${value}`;
  return publicWriteFn('POW_ATT', instructValue);
};

//获取截图
// {
//     instr_name: params.instr_name,
//     img_path: params.img_path,
//   };
export const GET_SCREEN_CAPTURE = (img_path: string, timeout: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const params = {
        instr_name: pinpuConnectionName,
        img_path: img_path,
        instructName: '获取结果截图',
      };
      let config = {};
      if (timeout) {
        config = {
          timeout,
        };
      }
      await get_screen_capture(params, config);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
//设置频谱连接超时时间
// let obj = {
//   instr_name: params.instr_name,
//   img_path: params.timeout,
// };
export const SET_TIMEOUT = (timeout: number) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      const params = {
        instr_name: pinpuConnectionName,
        timeout,
        instructName: '设置频谱超时时长',
      };
      await set_timeout(params);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
//判定频谱是否测试结束
export const STAT_OPER_COND = async () => {
  const command = `:STAT:OPER:COND?`;
  try {
    while (true) {
      const params = {
        instr_name: pinpuConnectionName,
        command,
        instructName: '获取频谱测试状态',
      };
      const rst: string = await query_fn(params);
      const newRst = rst?.replace(/\s/g, '');
      if (String(newRst) === '0') {
        return Promise.resolve();
      } else {
        await delayTime(3000);
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
