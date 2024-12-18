/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\configValidate\bandEdge\bandedgeLimit.js
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 09:42:49
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
const path = require("path");
const { appConfigFilePath } = require("../../publicData");
const getBandedgeLimitList = require("./getBandedgeLimitList");
const { outputJson, pathExists, readJson } = require("fs-extra");
const configFilePath = path.join(
  appConfigFilePath,
  `user/limitConfig/bandedge limit.xlsx`
);
// 写入本地
let resultconfigFilePath = path.join(
  appConfigFilePath,
  `app/emissionLimit.json`
);
const { logError } = require("../../logger/logLevel");

module.exports = async (isRefresh) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(resultconfigFilePath)
      if (flag) {
        return Promise.resolve()
      }
    }

    const RESULT = await getBandedgeLimitList(configFilePath);

    await outputJson(resultconfigFilePath, RESULT);
  } catch (error) {
    const msg = `bandedgeLimit 生成错误: ${error}`
    logError(msg)
  }
};
