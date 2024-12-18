/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\testIndex\index.js
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 17:46:26
 * @Descripttion: 主测试函数
 */
const {
  getResultFilePath,
  refreshResult,
} = require("./util");
const { addLogFn, childSendMainMessage } = require("../utils");
const { logError, logInfo } = require('../utils/logLevel')

const SPECTRUM_TEST = require('./spectrum')
//循环测试函数?循环每一条数据
module.exports = async (TestParams) => {
  try {
    const { currentSelectedItem, parentProjectName, subProjectName } = TestParams
    //获取测试需测试的条目
    const resultFilePath = getResultFilePath(parentProjectName, subProjectName);
    //是否跳过有结果的列
    //切换测试用例时初始化基站
    const { id } = currentSelectedItem;
    //开始设置频谱
    const result = await SPECTRUM_TEST(currentSelectedItem);
    logInfo(`测试结果:${result},开始更新本地数据库`)
    //更新本地数据
    await refreshResult(id, result, resultFilePath);
    //------------------------------测试结束
    //通知main > kill子进程
    childSendMainMessage("processExit", { status: "success" });
    logInfo(`测试已完成 ${parentProjectName} / ${subProjectName} / ${id}`)
  } catch (error) {
    logError(String(error))
    //添加error log
    addLogFn(`error_-_${String(error)}`);
    //通知main > kill子进程
    childSendMainMessage("processExit", { status: "error" });
  }
};
