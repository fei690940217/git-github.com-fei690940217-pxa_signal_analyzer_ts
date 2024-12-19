/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-29 16:58:00
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:31:38
 * @FilePath: \pxa_signal_analyzer\src\testProcess\utils\restartVisaProxy.js
 * @Description: 强制重启visa代理
 */
import { visaProxyFileName } from '@src/common';

const axios = require('axios');
const path = require('path');
const childProcess = require('child_process');
const {
  appConfigFilePath,
  electronStore,
  defaultPort,
} = require('../../main/publicData');
const baseURL = require('../../main/publicData/baseURL');
const { delayTime } = require('./index');
const createSpectrumConnection = require('./createSpectrumConnection.js');

//判断端口可用情况,如果不可用会返回一个可用端口
const portfinder = require('portfinder');
//默认端口
//启动visa代理
const runVisaProxy = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const port = await portfinder.getPortPromise({
        port: defaultPort,
      });
      let python_proxy_filename = path.join(
        appConfigFilePath,
        'app',
        'visaProxy',
        visaProxyFileName,
      );
      const child = childProcess.spawn(python_proxy_filename, [port], {
        detached: false,
      });
      //如果启动成功
      if (child.pid) {
        electronStore.set('visaProxyPort', port);
        resolve();
      } else {
        electronStore.set('visaProxyPort', null);
        reject('visa启动失败');
      }
    } catch (error) {
      reject(error);
    }
  });
};
//获取pid
const getPid = () => {
  return new Promise((resolve, reject) => {
    try {
      const targetProcessName = 'visa_proxy_only _spectrum.exe';
      let tasklistOutput = childProcess.execSync('tasklist', {
        encoding: 'utf-8',
      });
      const lines = tasklistOutput.split('\n');
      let pidList = [];
      for (let line of lines) {
        const columns = line.split(/\s+/);
        const processName = columns[0];
        const processId = columns[1];
        if (processName.toLowerCase() === targetProcessName.toLowerCase()) {
          pidList.push(processId);
        }
      }
      resolve(pidList);
    } catch (error) {
      reject(error);
    }
  });
};
//杀进程
const killProcess = (pidList) => {
  return new Promise((resolve, reject) => {
    try {
      for (let pid of pidList) {
        const killCommand = `taskkill /F /PID ${pid}`; // 假设要终止的进程ID为 12345
        childProcess.execSync(killCommand);
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
//重启>一条龙,重启,鉴权,键连接
module.exports = () => {
  return new Promise(async (resolve, reject) => {
    try {
      //找到visa的pid
      const pidList = await getPid();
      //如果visaProxy正在运行 kill
      if (pidList?.length) {
        await killProcess(pidList);
      }
      //重新启动进程
      await runVisaProxy();
      //等待3s
      await delayTime(3000);
      //鉴权
      await axios.post(`${baseURL}/check_auth`, {});
      //创建频谱连接
      await createSpectrumConnection();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
