/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\api\errorHandle\index.ts
 * @Author: xxx
 * @Date: 2023-05-08 13:27:31
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:28:10
 * @Descripttion: 异常处理函数,用于判断连接中的
 */
import { pinpuConnectionName } from '@src/common';

import axios from 'axios';
import { addLogFn, delayTime } from '@src/testProcess/utils';
import { logInfo, logError } from '@src/testProcess/utils/logLevel';

//重启一条龙
import restartVisaProxy from '@src/testProcess/utils/restartVisaProxy';
//基站连接名称
import baseURL from '@src/main/publicData/baseURL';
import createSpectrumConnection from '@src/testProcess/utils/createSpectrumConnection';

//获取返回值,无所谓结果,只要能返回就行
const get_instr_list = async () => {
  try {
    await axios.post(`${baseURL}/get_instr`, {});
    return true;
  } catch (error) {
    logError(error.toString());
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
      logError(res.data?.errmsg);
      return false;
    }
  } catch (error) {
    logError(error.toString());

    return false;
  }
};

export default async (originalRequest, instance) => {
  //第一步:判断是否需要重试
  if (originalRequest._retry > 3) {
    return Promise.reject('三次重试无效,请尝试手动解决');
  } else {
    if (originalRequest._retry) {
      originalRequest._retry += 1;
    } else {
      originalRequest._retry = 1;
    }
    originalRequest.timeout = 20000;
    addLogFn(`warning_-_开始第${originalRequest._retry}次重试`);
  }
  //第一次重试,特殊处理一下,不在等待,判断等,直接重试,因为错误有可能来自进程卡顿
  if (originalRequest._retry === 1) {
    return instance.request(originalRequest);
  }
  //重试一次无效,需要进行连接判断
  else {
    //第二步:判断visaProxy是否正常
    //判断visaProxy本身的状态是否卡死
    addLogFn(`info_-_判断VisaProxy状态`);
    const visaStatus = await get_instr_list();
    //visaProxy没有卡死
    if (visaStatus) {
      addLogFn(`info_-_VisaProxy正常,准备检查 visa--设备 连接`);
      //判断visa与设备之间的状态是否正常
      const visa_device_status = await queryIDN();
      if (visa_device_status) {
        addLogFn(`success_-_Visa--设备 连接正常`);
      }
      //visa与设备之间连接无效,或者设备被卡住了,需要重建连接
      else {
        addLogFn(`error_-_Visa--设备 连接无效,开始连接重建`);
        await createSpectrumConnection();
      }
    }
    //visaProxy卡死,直接重启一条龙
    else {
      addLogFn(`error_-_visaProxy无效,准备重启visa`);
      await restartVisaProxy();
      addLogFn(`success_-_visaProxy已重启`);
    }
    //最后一步:启动重试函数
    await delayTime(2000);
    return instance.request(originalRequest);
  }
};
