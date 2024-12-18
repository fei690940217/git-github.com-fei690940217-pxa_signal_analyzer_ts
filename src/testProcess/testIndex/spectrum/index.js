/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\testIndex\spectrum\index.js
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 11:43:29
 * @Descripttion: 频谱测试主函数(在此区分各测试用例)
 */
const { delayTime, addLogFn, childSendMainMessage } = require("../../utils");
const visaProxySpectrumConnection = require("../../utils/visaProxySpectrumConnection");

const OBW_TEST = require("./OBW");
const PAR_TEST = require("./PAR");
const CSE_TEST = require("./CSE");
const CSE_GATE_TEST = require("./CSE/CSEGate");
const BandEdge_TEST = require("./BandEdge");
const BandEdge_GATE_TEST = require("./BandEdge/bandEdgeGate");

//循环测试函数?循环每一条数据
module.exports = (subItem) => {
  return new Promise(async (resolve, reject) => {
    try {
      addLogFn(`success_-_开始判断连接状态`);
      await visaProxySpectrumConnection();
      addLogFn(`success_-_连接正常`);
      let result = "";
      const { testItem, isGate, duplexMode } = subItem;
      if (testItem === "PAR") {
        result = await PAR_TEST(subItem);
      } else if (testItem === "OBW") {
        result = await OBW_TEST(subItem);
      } else if (testItem === "CSE") {
        if (isGate && duplexMode === "TDD") {
          result = await CSE_GATE_TEST(subItem);
        } else {
          result = await CSE_TEST(subItem);
        }
      } else if (testItem === "BandEdge") {
        if (isGate && duplexMode === "TDD") {
          result = await BandEdge_GATE_TEST(subItem);
        } else {
          result = await BandEdge_TEST(subItem);
        }
      } else if (testItem === "BandEdgeIC") {
        result = await BandEdge_TEST(subItem);
      }
      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
};
