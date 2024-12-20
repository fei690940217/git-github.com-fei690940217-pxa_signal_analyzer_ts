/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\spectrum\PAR\index.ts
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:55:39
 * @Descripttion: 基站测试函数
 */

import { delayTime, addLogFn } from '@src/testProcess/utils';
import SharedParameters from '@src/testProcess/globals';
import {
  publicWriteFn,
  publicQueryFn,
  getImgPath,
  CABLE_LOSS,
  POW_ATT,
  GET_SCREEN_CAPTURE,
  SET_TIMEOUT,
  STAT_OPER_COND,
} from '../testFunctionList';
import { ResultItemType } from '@src/customTypes/renderer';

const resultNumHandle = (result) => {
  try {
    if (result) {
      const number = Number(result.split(',')[4]);
      if (isNaN(number)) {
        return '';
      } else {
        return Number(number.toFixed(2));
      }
    } else {
      return '';
    }
  } catch (error) {
    return '';
  }
};
//循环测试函数?循环每一条数据
export default (subItem: ResultItemType) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      //添加error log
      const log = `success_-_开始设置频谱`;
      addLogFn(log);
      const { Band, BW, DLFreq, id, duplexMode } = subItem;
      const isFDD = duplexMode === 'FDD';
      //1.重置
      await publicWriteFn('reset', 'SYST:PRES');
      //等待2s
      await delayTime(2000);
      await publicWriteFn('CAL_AUTO_OFF', 'CALibration:AUTO OFF');
      await publicWriteFn('CAL_AUTO_ALERT_WEEK', 'CALibration:AUTO:ALERt WEEK');
      //设置线损
      await CABLE_LOSS(DLFreq);
      await publicWriteFn('CONF_PST', `:CONFigure:PSTatistic`);
      //freq 需要参数
      await publicWriteFn('FREQ', `:SENSe:FREQuency:CENTer ${DLFreq}MHz`);
      //SEN_PST_COUN 固定 100000
      await publicWriteFn('SEN_PST_COUN', `:SENSe:PST:COUN 1000000`);
      //设置BW
      await publicWriteFn('BW', `:SENSe:PSTatistic:BANDwidth ${BW}MHz`);
      //POW_ATT
      await POW_ATT();
      //  TRIG:PST:SOUR IMM
      //FDD
      if (isFDD) {
        //SCHeduling
        const { Scenario } = SharedParameters.get('spectrumConfig');
        if (Scenario === 'PUSCH_RMC') {
          await publicWriteFn('TRIG_PST_SOUR_IMM', 'TRIG:PST:SOUR IMM');
        } else {
          await publicWriteFn('TRIG_PST_SOUR_RFB', 'TRIG:PST:SOUR RFB');
        }
        await publicWriteFn('PST_SWE_TIME', 'PST:SWE:TIME 1 ms');
      }
      //TDD
      else {
        await publicWriteFn('TRIG_PST_SOUR_RFB', 'TRIG:PST:SOUR RFB');
        await publicWriteFn('PST_SWE_TIME', 'PST:SWE:TIME 50 us');
      }
      //等待2s
      await delayTime(2000);
      //频谱界面数值暂停
      await publicWriteFn('单次扫描', `:INIT:CONT OFF`);
      await STAT_OPER_COND();
      //等待1.5s
      await delayTime(1500);
      //设置频谱超时 60000
      await SET_TIMEOUT(60000);
      //读取结果  item:'PST1'  结果为科学计数法 需转换为 10进制
      const rawData = await publicQueryFn('获取频谱结果', `:FETC:PST1?`, 60000);
      const resultData = resultNumHandle(rawData);
      //获取截图 img_path 照片路径
      const imgPath = getImgPath(id);
      await GET_SCREEN_CAPTURE(imgPath, 60000);
      //返回测试结果
      resolve(resultData);
    } catch (error) {
      reject(error);
    }
  });
};
