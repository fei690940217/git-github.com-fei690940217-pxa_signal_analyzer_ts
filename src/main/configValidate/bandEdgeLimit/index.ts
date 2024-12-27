/*
 * @Author: feifei
 * @Date: 2024-12-26 15:30:27
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 15:45:37
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\bandEdgeLimit\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import path from 'path';
import { appConfigFilePath } from '@src/main/publicData';
import getBandedgeLimitList from './getBandedgeLimitList';
import { outputJson, pathExists, readJson } from 'fs-extra';
import { logError } from '@src/main/logger/logLevel';
type LimitKey = 'IC' | 'Gate' | 'Normal';
//IC
const filePath = {
  IC: {
    from: path.join(
      appConfigFilePath,
      `user/limitConfig/bandedge limit ic.xlsx`,
    ),
    to: path.join(appConfigFilePath, `app/emissionLimitIC.json`),
  },
  Gate: {
    from: path.join(
      appConfigFilePath,
      `user/limitConfig/bandedge limit gate.xlsx`,
    ),
    to: path.join(appConfigFilePath, `app/emissionLimitGate.json`),
  },
  Normal: {
    from: path.join(appConfigFilePath, `user/limitConfig/bandedge limit.xlsx`),
    to: path.join(appConfigFilePath, `app/emissionLimit.json`),
  },
};
const LimitList: LimitKey[] = ['IC', 'Gate', 'Normal'];
export default async (isRefresh: boolean = false) => {
  try {
    for (const key of LimitList) {
      // 判断是否需要更新
      if (!isRefresh) {
        const toPath = filePath[key].to;
        const flag = await pathExists(toPath);
        if (flag) {
          continue;
        }
      }
      const RESULT = await getBandedgeLimitList(filePath[key].from);
      await outputJson(filePath[key].to, RESULT);
    }
    return Promise.resolve();
  } catch (error) {
    const msg = `bandedgeLimit 生成错误: ${error}`;
    logError(msg);
  }
};
