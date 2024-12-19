/*
 * @Author: feifei
 * @Date: 2023-05-17 09:32:41
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:28:56
 * @FilePath: \pxa_signal_analyzer\src\testProcess\utils\createSpectrumConnection.js
 * @Description: 测试模块的utils函数
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { pinpuConnectionName } from '@src/common';

const createConnectRequest = require('../api/createConnectRequest');
const { addLogFn } = require('./index');
const SharedParameters = require('../globals');
const { logInfo, logError } = require('./logLevel');

const create_instr_fn = (params, config = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await createConnectRequest.post(
        `/create_instr`,
        params,
        config,
      );
      if (res.data.error === 0) {
        resolve();
      } else {
        reject(res.data.errmsg);
      }
    } catch (error) {
      reject(error);
    }
  });
};
//连接频谱
module.exports = async () => {
  try {
    const config = SharedParameters.get('spectrumConfig');
    const { ip } = config;
    const params = {
      instructName: '创建频谱连接',
      instr_name: pinpuConnectionName,
      mode: 'ip',
      ip,
    };
    try {
      await create_instr_fn(params);
    } catch (error) {
      addLogFn(`error_-_${error},准备重试 `);
      await create_instr_fn(params);
    }
    return Promise.resolve();
  } catch (error) {
    logError(error.toString());
    return Promise.reject(error);
  }
};
