/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\spectrum\index.ts
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:21:21
 * @Descripttion: 频谱测试主函数(在此区分各测试用例)
 */
import { delayTime, addLogFn, childSendMainMessage } from '../../utils';
import visaProxySpectrumConnection from '../../utils/visaProxySpectrumConnection';

import OBW_TEST from './OBW';
import PAR_TEST from './PAR';
import CSE_TEST from './CSE';
import CSE_GATE_TEST from './CSE/CSEGate';
import BandEdge_TEST from './BandEdge';
import BandEdge_GATE_TEST from './BandEdge/bandEdgeGate';

//循环测试函数?循环每一条数据
export default (subItem) => {
  return new Promise(async (resolve, reject) => {
    try {
      addLogFn(`success_-_开始判断连接状态`);
      await visaProxySpectrumConnection();
      addLogFn(`success_-_连接正常`);
      let result = '';
      const { testItem, isGate, duplexMode } = subItem;
      if (testItem === 'PAR') {
        result = await PAR_TEST(subItem);
      } else if (testItem === 'OBW') {
        result = await OBW_TEST(subItem);
      } else if (testItem === 'CSE') {
        if (isGate && duplexMode === 'TDD') {
          result = await CSE_GATE_TEST(subItem);
        } else {
          result = await CSE_TEST(subItem);
        }
      } else if (testItem === 'BandEdge') {
        if (isGate && duplexMode === 'TDD') {
          result = await BandEdge_GATE_TEST(subItem);
        } else {
          result = await BandEdge_TEST(subItem);
        }
      } else if (testItem === 'BandEdgeIC') {
        result = await BandEdge_TEST(subItem);
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
