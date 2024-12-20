/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\configValidate\bandEdge\bandedgeICLimit.js
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 09:45:59
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
import path from 'path';
import { appConfigFilePath } from '../../publicData';
import getBandedgeLimitList from './getBandedgeLimitList';
import { outputJson, pathExists, readJson } from 'fs-extra';
const configFilePath = path.join(
  appConfigFilePath,
  `user/limitConfig/bandedge limit ic.xlsx`,
);
// 写入本地
let resultconfigFilePath = path.join(
  appConfigFilePath,
  `app/emissionLimitIC.json`,
);
import { logError } from '../../logger/logLevel';

export default async (isRefresh) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(resultconfigFilePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const RESULT = await getBandedgeLimitList(configFilePath);

    await outputJson(resultconfigFilePath, RESULT);
  } catch (error) {
    const msg = `bandedgeICLimit 生成错误: ${error}`;
    logError(msg);
  }
};
