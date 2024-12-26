/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\spectrum\OBW\index.ts
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 16:51:43
 * @Descripttion: 基站测试函数
 */
import { delayTime, addLogFn } from '@src/testProcess/utils';
import { logError } from '@src/testProcess/utils/logLevel';

//公用函数
import {
  publicWriteFn,
  publicQueryFn,
  getImgPath,
  POW_ATT,
  GET_SCREEN_CAPTURE,
  SET_TIMEOUT,
  CABLE_LOSS,
  STAT_OPER_COND,
} from '../testFunctionList';
import { ResultItemType } from '@src/customTypes/renderer';

//结果处理函数
const resultNumHandle = (result: string, BW: number) => {
  try {
    if (result) {
      const digitOBW = BW === 5 || BW === 10 ? 4 : 3;
      const resultArray = result.split(',');
      const obw = (parseFloat(resultArray[0]) / 1000000).toFixed(digitOBW);
      const BW26dB = (parseFloat(resultArray[6]) / 1000000).toFixed(3);
      if (isNaN(parseFloat(obw)) || isNaN(parseFloat(BW26dB))) {
        return '';
      } else {
        return `${obw},${BW26dB}`;
      }
    } else {
      return '';
    }
  } catch (error) {
    logError(error?.toString() || 'OBW结果处理函数错误 41');
    return '';
  }
};
//RBW,VBW参数
// const RBW_VBW_OBJ = {
//   5: { RBW: 51, VBW: 160 },
//   10: { RBW: 100, VBW: 300 },
//   15: { RBW: 150, VBW: 470 },
//   20: { RBW: 200, VBW: 620 },
//   25: { RBW: 270, VBW: 820 },
//   30: { RBW: 300, VBW: 910 },
//   35: { RBW: 360, VBW: 1100 },
//   40: { RBW: 430, VBW: 1300 },
//   45: { RBW: 470, VBW: 1500 },
//   50: { RBW: 510, VBW: 1600 },
//   60: { RBW: 620, VBW: 2000 },
//   70: { RBW: 750, VBW: 2400 },
//   80: { RBW: 820, VBW: 2700 },
//   90: { RBW: 910, VBW: 3000 },
//   100: { RBW: 1000, VBW: 3000 },
// };
//   <甘静>  给的
const RBW_VBW_OBJ: Record<number, { RBW: number; VBW: number }> = {
  5: { RBW: 75, VBW: 240 },
  10: { RBW: 150, VBW: 470 },
  15: { RBW: 220, VBW: 680 },
  20: { RBW: 300, VBW: 910 },
  25: { RBW: 270, VBW: 820 },
  30: { RBW: 470, VBW: 1500 },
  35: { RBW: 510, VBW: 1600 },
  40: { RBW: 620, VBW: 2000 },
  45: { RBW: 680, VBW: 2400 },
  50: { RBW: 750, VBW: 2400 },
  60: { RBW: 910, VBW: 3000 },
  70: { RBW: 1100, VBW: 4000 },
  80: { RBW: 1200, VBW: 4000 },
  90: { RBW: 1350, VBW: 4000 },
  100: { RBW: 1500, VBW: 5000 },
};
//循环测试函数?循环每一条数据
export default (subItem: ResultItemType) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      //添加error log
      const log = `success_-_开始设置频谱`;
      addLogFn(log);
      const { Band, BW, DLFreq, id } = subItem;
      //初始化OBW
      await publicWriteFn('初始化OBW', 'SYST:PRES');
      //打开OBW
      await publicWriteFn('打开OBW', ':CONF:OBW');
      //freq 需要参数
      await publicWriteFn('FREQ', `:SENSe:FREQuency:CENTer ${DLFreq}MHz`);
      //线损
      await CABLE_LOSS(DLFreq);
      //SPAN
      await publicWriteFn('SPAN', `:SENSe:OBWidth:FREQuency:SPAN ${BW * 2}MHz`);
      //RBW+VBW
      const { RBW, VBW } = RBW_VBW_OBJ[BW];
      await publicWriteFn(
        'RBW',
        `:SENSe:OBWidth:BANDwidth:RESolution ${RBW}KHz`,
      );
      await publicWriteFn('VBW', `:SENSe:OBWidth:BANDwidth:VIDeo ${VBW}KHz`);
      await publicWriteFn('PERCent', `:SENSe:OBWidth:PERCent 99`);
      await publicWriteFn('XDB', `:SENSe:OBWidth:XDB -26dB`);
      await publicWriteFn('SWE_TIME_AUTO', `:SENSe:OBWidth:SWEep:TIME 5ms`);
      await publicWriteFn(
        'DETector_FUNCtion',
        `:SENSe:OBWidth:DETector:FUNCtion Positive`,
      );
      await publicWriteFn('AVER_COUN', `OBW:AVER:COUN 100`);
      await publicWriteFn(
        'SCALe_RLEVel',
        `DISPlay:OBWidth:VIEW:WINDow:TRACe:Y:SCALe:RLEVel 30`,
      );
      //POW_ATT
      await POW_ATT();
      //等待2s
      await delayTime(2000);
      await publicWriteFn('TRAC_OBW_TYPE_MAX', `TRACe1:OBWidth:TYPE MAXhold`);
      //等待2s
      await delayTime(2000);
      //锁定频谱界面
      await publicWriteFn('单次扫描', `:INIT:CONT OFF`);
      //------------------------------------------------判断测试结束
      //判断测试状态
      await STAT_OPER_COND();
      await SET_TIMEOUT(60000);
      //读取结果  item:'OBWidth'  结果为科学计数法 需转换为 10进制
      //最终返回的数据
      const rawData = await publicQueryFn(
        '获取频谱结果',
        `:FETC:OBWidth?`,
        60000,
      );
      //处理原始数据
      const resultData = resultNumHandle(rawData, BW);
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
