/*
 * @FilePath: \fcc_5g_test_system\testProcess\testFunction\spectrum\BandEdge\bandEdgeGate.js
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2023-12-07 17:24:58
 * @Descripttion: CSE
 */
import { delayTime, addLogFn } from '../../../utils';

//公用函数
import {
  publicWriteFn,
  publicQueryFn,
  getImgPath,
  POW_ATT,
  GET_SCREEN_CAPTURE,
  SET_TIMEOUT,
  STAT_OPER_COND,
  CABLE_LOSS,
} from '../testFunctionList';

//OBW专用函数
import { getRepeatString, resultNumHandle } from './testFunctionList';

//循环测试函数?循环每一条数据
export default (subItem) => {
  return new Promise(async (resolve, reject) => {
    try {
      //添加error log
      const log = `success_-_开始设置频谱`;
      addLogFn(log);
      const {
        Band,
        duplexMode,
        BW,
        DLFreq,
        id,
        isSecond,
        rangeStart,
        rangeStop,
        no,
        RBW,
        VBW,
        start,
        stop,
        limit,
        sweepTime,
        sweepPoint,
      } = subItem;
      const isFDD = duplexMode === 'FDD';
      //初始化CSE
      await publicWriteFn('初始化', ':SYST:PRES', 20000);
      await publicWriteFn('进入杂散模式', ':CONFigure:SPURious');
      // await publicWriteFn("*CLS", "*CLS")
      await publicWriteFn('REPT_MODE', `:SENSe:SPURious:REPT:MODE MMAR`);
      //线损
      await CABLE_LOSS(DLFreq);
      await publicWriteFn(
        'Y_RLEV',
        ':DISPlay:SPUR:VIEW:WINDow:TRACe:Y:SCALe:RLEVel 30 dBm',
      );
      //POW_ATT
      await POW_ATT();
      await publicWriteFn(
        'LIST:STATe',
        ':SENSe:SPURious:RANGe:LIST:STATe 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0',
      );
      //计算 rangeListState
      const rangeListState = await getRepeatString('1', no);
      await publicWriteFn(
        'LIST:STATe',
        `:SENSe:SPURious:RANGe:LIST:STATe ${rangeListState}`,
      );
      const START_STR = start.map((item) => `${item}MHz`).join(',');
      await publicWriteFn(
        'FREQuency_Start',
        `:SENSe:SPURious:RANGe:LIST:FREQuency:Start ${START_STR}`,
      );
      const STOP_STR = stop.map((item) => `${item}MHz`).join(',');
      await publicWriteFn(
        'FREQuency_Stop',
        `:SENSe:SPURious:RANGe:LIST:FREQuency:Stop ${STOP_STR}`,
      );
      const VBW_STR = VBW.map((item) => `${item}KHz`).join(',');
      await publicWriteFn(
        'VBW',
        `:SENSe:SPURious:RANGe:LIST:BANDwidth:Video ${VBW_STR}`,
      );
      const RBW_STR = RBW.map((item) => `${item}KHz`).join(',');
      await publicWriteFn(
        'RBW',
        `:SENSe:SPURious:RANGe:LIST:BANDwidth:RESolution ${RBW_STR}`,
      );
      //计算 POINts  读表???????
      const tempSweepPoint = sweepPoint.join(',');
      await publicWriteFn(
        'SweepPoint',
        `:SENSe:SPURious:list:SWEep:POINts ${tempSweepPoint}`,
      );
      //sweepTime
      const tempSweepTime = sweepTime.join(',');
      await publicWriteFn('sweepTime', `SPUR:SWE:TIME ${tempSweepTime}`);
      const LIMIT_STR = limit.map((item) => `${item}dBm`).join(',');
      await publicWriteFn('ABS_DATA', `:CALC:SPUR:LIM:ABS:DATA ${LIMIT_STR}`);
      await delayTime(1500);
      //计算 detector_str
      const detectorStr = await getRepeatString('AVERage', no);
      await publicWriteFn(
        'DETector1_FUNCtion',
        `:SENSe:SPURious:list:DETector1:FUNCtion ${detectorStr}`,
      );
      await publicWriteFn(
        'DETector2_FUNCtion',
        `:SENSe:SPURious:list:DETector2:FUNCtion ${detectorStr}`,
      );
      // AVER_ON
      await publicWriteFn('AVER_ON', `:SENSe:SPURious:AVER ON`);
      //AVER_COUN
      await publicWriteFn('AVER_COUN', `:SENSe:SPURious:AVER:COUN 1`);
      await publicWriteFn('VIEW_SELect', `:DISPlay:SPURious:VIEW:SELect ALL`);
      await delayTime(2000);
      //Gate延时
      await publicWriteFn('Gate延时', ':SWEep:EGATe:DELay 5ms');
      //Gate长度
      await publicWriteFn('Gate长度', ':SWEep:EGATe:LENGth 1ms');
      //打开Gate   :SWEep:EGATe 1
      await publicWriteFn('打开Gate', ':SWEep:EGATe 1');
      await publicWriteFn('单次扫描', ':INIT:CONT OFF');
      //等待
      await delayTime(1500);
      await STAT_OPER_COND();
      await publicWriteFn('MARK1_MODE_OFF', `:CALC:SPUR:MARK1:MODE OFF`);
      //读取结果前重置超时 60000
      await SET_TIMEOUT(60000);
      //读取结果  item:'SPUR'  结果为科学计数法 需转换为 10进制
      const rawData = await publicQueryFn('获取频谱结果', `:FETC:SPUR?`, 60000);
      //处理原始数据
      const resultData = await resultNumHandle(rawData);
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
