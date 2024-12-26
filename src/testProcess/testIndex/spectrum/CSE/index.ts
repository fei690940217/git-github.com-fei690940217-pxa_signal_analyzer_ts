/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\spectrum\CSE\index.ts
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 16:59:00
 * @Descripttion: CSE
 */
import { delayTime, addLogFn } from '@src/testProcess/utils';

//公用函数
import {
  publicWriteFn,
  publicQueryFn,
  getImgPath,
  GET_SCREEN_CAPTURE,
  SET_TIMEOUT,
  STAT_OPER_COND,
} from '../testFunctionList';

//公用函数
import {
  CABLE_LOSS,
  MARKER_POINTS,
  SWE_POINT,
  resultNumHandle,
} from './testFunctionList';
import { ResultItemType } from '@src/customTypes/renderer';

//循环测试函数?循环每一条数据
export default (subItem: ResultItemType) => {
  return new Promise<string>(async (resolve, reject) => {
    try {
      //添加error log
      const log = `success_-_开始设置频谱`;
      addLogFn(log);
      const {
        duplexMode,
        DLFreq,
        id,
        CSE_Limit,
        rangeStart,
        rangeStop,
        atten,
        segmentNumber,
        VBW,
        RBW,
      } = subItem;
      const isFDD = duplexMode === 'FDD';

      //设置频谱超时 3000
      await SET_TIMEOUT(3000);
      //初始化CSE
      await publicWriteFn('初始化CSE', ':SYST:PRES');
      await publicWriteFn('DISP_WIND_TRAC_Y_RLEV', `DISP:WIND:TRAC:Y:RLEV 0`);
      //POW_ATT
      await publicWriteFn('POW_ATT', `POW:ATT ${atten}`);
      await publicWriteFn(
        'FREQ_START',
        `:SENSe:FREQuency:Start ${rangeStart} MHz`,
      );
      await publicWriteFn(
        'FREQ_STOP',
        `:SENSe:FREQuency:Stop ${rangeStop} MHz`,
      );
      //线损 需添加占空比
      await CABLE_LOSS(DLFreq, isFDD);
      //VBW
      await publicWriteFn(
        'VBW',
        `:SENSe:BANDwidth:Video ${parseFloat(VBW) / 1000} MHz`,
      );
      //RBW
      await publicWriteFn(
        'RBW',
        `:SENSe:BANDwidth:RESolution ${parseFloat(RBW) / 1000} MHz`,
      );
      //扫描时间
      await publicWriteFn('SWEEP_TIME', `:SENSe:SWEep:TIME:AUTO on`);
      //SWE_POINT
      await SWE_POINT(subItem);
      //AVER_COUN
      await publicWriteFn('AVER_COUN', `AVER:COUN 100`);
      await publicWriteFn('DISP_WIND_TRAC_Y_RLEV', `DISP:WIND:TRAC:Y:RLEV 30`);
      await publicWriteFn('MARK_TABL', `CALC:MARK:TABL ON`);
      //limit
      await publicWriteFn('设置Limit', `DISP:WIND:TRAC:Y:DLIN ${CSE_Limit}`);
      await publicWriteFn(
        'DETector1_FUNCtion_AVERage',
        `:SENSe:DETector1:FUNCtion AVERage`,
      );
      await publicWriteFn('TRAC1_TYPE_AVERage', `TRAC1:TYPE AVERage`);
      //判断测试状态
      await delayTime(5000);
      //  单次扫描/锁定屏幕
      await publicWriteFn('单次扫描', `:INIT:CONT OFF`);
      //获取频谱状态 直到稳定
      await STAT_OPER_COND();
      //peak_list_x = []
      await publicWriteFn('', 'calc:mark:peak:exc:stat off');
      //peak_list_y = []
      await publicWriteFn('', 'calc:mark:peak:thr:stat off');
      //读取结果前重置超时 60000
      await SET_TIMEOUT(60000);
      //标点逻辑开始  内部处理一段二段
      await MARKER_POINTS(subItem);
      //最终返回的数据
      const markerNo = segmentNumber === 1 ? 2 : 1;
      const rstX = await publicQueryFn(
        `获取MARKer${markerNo} X`,
        `:CALCulate:MARKer${markerNo}:X?`,
      );
      const rstY = await publicQueryFn(
        `获取MARKer${markerNo} Y`,
        `:CALCulate:MARKer${markerNo}:Y?`,
      );
      //处理原始数据
      const resultData = resultNumHandle(rstX, rstY);

      //获取截图 img_path 照片路径
      const imgPath = getImgPath(id);
      await GET_SCREEN_CAPTURE(imgPath, 60000);
      //重置超时 3000
      await SET_TIMEOUT(3000);
      //返回测试结果
      resolve(resultData);
    } catch (error) {
      reject(error);
    }
  });
};
