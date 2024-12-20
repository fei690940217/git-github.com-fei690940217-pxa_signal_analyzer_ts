/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\spectrum\BandEdge\index.ts
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:25:36
 * @Descripttion: CSE
 */
import { delayTime, addLogFn, childSendMainMessage } from '../../../utils';

//公用函数
import {
  publicWriteFn,
  publicQueryFn,
  getImgPath,
  POW_ATT,
  GET_SCREEN_CAPTURE,
  SET_TIMEOUT,
  STAT_OPER_COND,
} from '../testFunctionList';

//OBW专用函数
import { CABLE_LOSS, resultNumHandle } from './testFunctionList';
const getRepeatString = (str, num) => {
  return Array(num).fill(str).join(',');
};
//循环测试函数?循环每一条数据
export default (subItem) => {
  return new Promise(async (resolve, reject) => {
    try {
      //添加error log
      const log = `success_-_开始设置频谱`;
      addLogFn(log);
      const {
        duplexMode,
        DLFreq,
        id,
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
      await CABLE_LOSS(DLFreq, isFDD);
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
      const rangeListState = getRepeatString('1', no);
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
      //PEAK EXCursion
      await publicWriteFn(
        'PEAK EXCursion',
        `:SENSe:SPURious:RANGe:LIST:PEAK:EXCursion ${getRepeatString('0', no)}`,
      );
      //:SENSe:SPURious:RANGe:LIST:PEAK:THReshold -120
      await publicWriteFn(
        'PEAK THReshold',
        `:SENSe:SPURious:RANGe:LIST:PEAK:THReshold ${getRepeatString(
          '-120',
          no,
        )}`,
      );
      //:SENSe:SPURious:RANGe:LIST:BANDwidth:SHAPE FLATtop
      await publicWriteFn(
        'FLATtop',
        `:SENSe:SPURious:RANGe:LIST:BANDwidth:SHAPE ${getRepeatString(
          'FLATtop',
          no,
        )}`,
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
      await publicWriteFn('VIEW_SELect', `:DISPlay:SPURious:VIEW:SELect ALL`);
      //计算 detector_str  官网示例
      //       [:SENSe]:SPURious[:RANGe][:LIST]:DETector[1][:FUNCtion]
      // AVERage|NEGative|NORMal|POSitive|SAMPle|RMS, ...
      //  [:SENSe]:SPURious[:RANGe][:LIST]:DETector2[:FUNCtion]
      // OFF|AVERage|NEGative|NORMal|POSitive|SAMPle|RMS, ...
      //  [:SENSe]:SPURious[:RANGe][:LIST]:DETector[1]|2[:FUNCtion]
      const detectorStr = getRepeatString('AVERage', no);
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
      await publicWriteFn('AVER_COUN', `:SENSe:SPURious:AVER:COUN 100`);
      //等待
      await delayTime(1500);
      //等待时间
      await publicWriteFn('单次扫描', ':INIT:CONT OFF');
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
