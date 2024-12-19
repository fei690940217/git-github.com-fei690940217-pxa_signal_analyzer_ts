/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\utils\visaProxySpectrumConnection.js
 * @Author: xxx
 * @Date: 2023-05-08 13:27:31
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:29:07
 * @Descripttion: visaProxy代理连接
 */
import { pinpuConnectionName } from '@src/common';

const axios = require('axios');
//基站连接名称
const baseURL = require('../../main/publicData/baseURL.js');
//重启一条龙
const restartVisaProxy = require('./restartVisaProxy.js');
const { addLogFn } = require('./index');
const { logError, logInfo } = require('./logLevel.js');

const createSpectrumConnection = require('./createSpectrumConnection.js');

//获取返回值,无所谓结果,只要能返回就行
const get_instr_list = async () => {
  try {
    await axios.post(`${baseURL}/get_instr`, {});
    return true;
  } catch (error) {
    logError(`get_instr_list 失败 ${error}`);
    return false;
  }
};
//查询idn
const queryIDN = async () => {
  try {
    const params = {
      instr_name: pinpuConnectionName,
      command: '*IDN?',
    };
    const res = await axios.post(`${baseURL}/query`, params);
    if (res.data.error === 0) {
      return true;
    } else {
      logError(`IDN查询 失败 ${res.data?.errmsg}`);

      return false;
    }
  } catch (error) {
    logError(`IDN查询 失败 ${error}`);
    return false;
  }
};
module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const visaFlag = await get_instr_list();
      // visa有效性判断
      if (visaFlag) {
        addLogFn('visa有效');
        const IDNFlag = await queryIDN();
        //如果不能发送指令,重建频谱连接
        if (!IDNFlag) {
          addLogFn('visa--仪表 无效,准备创建频谱连接');
          await createSpectrumConnection();
        }
      }
      //visa无效
      else {
        addLogFn('visa无效,重启visa代理');
        //一条龙重启
        await restartVisaProxy();
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
