/*
 * @FilePath: \fcc_5g_test_system\main\configValidate\index.js
 * @Author: xxx
 * @Date: 2023-04-07 14:24:23
 * @LastEditors: feifei
 * @LastEditTime: 2024-01-22 14:08:11
 * @Descripttion:   测试用例数据验证与配置文件生成
 */

const configData = require("./configData");
const rbConfigData = require("./rbConfigData");
const authTypeObj = require("./authTypeObj");
const LTE_Band_List = require("./LTE_Band_List");
const LTE_ARFCN = require("./LTE_ARFCN");
const bandedgeLimit = require("./bandEdge/bandedgeLimit");
const bandedgeLimitGate = require("./bandEdge/bandedgeLimitGate");
const bandedgeLimitIC = require("./bandEdge/bandedgeICLimit");

const CSELimit = require("./CSELimit");
const { logError } = require("../logger/logLevel");

//参数:window实例
//isRefresh 判断是否是更新配置,如果是更新配置则全部重新生成,如果不是更新配置则只更新部分配置
async function fn(isRefresh) {
  try {
    await LTE_Band_List(isRefresh);
    LTE_ARFCN(isRefresh);
    //normal
    bandedgeLimit(isRefresh);
    //gate
    bandedgeLimitGate(isRefresh);
    //IC
    bandedgeLimitIC(isRefresh);
    CSELimit(isRefresh);
    //生成FCC,ce,telec 对应的band列表
    await authTypeObj(isRefresh);
    //生成RB配置文件
    rbConfigData(isRefresh);
    //验证通过>生成json形式的配置表存储在本地
    configData(isRefresh);
  } catch (error) {
    logError(error.toString())
  }
}
module.exports = fn;
