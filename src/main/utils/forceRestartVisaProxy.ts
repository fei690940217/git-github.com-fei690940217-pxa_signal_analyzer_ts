/*
 * @Author: feifei
 * @Date: 2024-12-05 17:43:23
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:31:26
 * @FilePath: \pxa_signal_analyzer\src\main\utils\forceRestartVisaProxy.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { visaProxyFileName, defaultPort } from '@src/common';
import { check_auth } from '@src/main/api/api';
import electronStore from '@src/main/electronStore';
import { appConfigFilePath } from '@src/main/publicData';
import path from 'path';
import childProcess from 'child_process';
import Papa from 'papaparse';
import { logError, logInfo } from '@src/main/logger/logLevel';
//判断端口可用情况,如果不可用会返回一个可用端口
import portfinder from 'portfinder';
const python_proxy_filename = path.join(
  appConfigFilePath,
  'app/visaProxy',
  visaProxyFileName,
);
//寻找进程的指令
const command = `tasklist /FO CSV | findstr /i "visa_proxy_only_spectrum"`;
const papaParse = (csvData) => {
  return new Promise((resolve, reject) => {
    try {
      // 使用 Papa.parse 解析 CSV 数据
      Papa.parse(csvData, {
        delimiter: ',', // CSV 文件的分隔符，默认是逗号
        header: false, // 不需要第一行作为头部（如果需要头部，可以设置为 true）
        dynamicTyping: true, // 自动将数字转换为数字类型
        skipEmptyLines: true, // 跳过空行
        complete: function (results) {
          resolve(results.data);
        },
      });
    } catch (error) {
      logError(`papaParse error: ${error}`);
      reject(error);
    }
  });
};
const killProcess = (pid) => {
  return new Promise((resolve, reject) => {
    try {
      const killCommand = `taskkill /F /PID ${pid}`; // 假设要终止的进程ID为 12345
      childProcess.exec(killCommand, (error, stdout, stderr) => {
        if (error) {
          reject(error); // 错误信息
          return;
        }
        if (stderr) {
          reject(new Error(stderr)); // 标准错误信息
          return;
        }
        resolve(stdout); // 标准输出结果
      });
    } catch (error) {
      logError(`killProcess error: ${error}`);
      reject(error);
    }
  });
};
//从进程看是否启动
const isRunningFn = async () => {
  try {
    let res = childProcess.execSync(command, { encoding: 'utf-8' });
    const flag =
      res.toLowerCase().indexOf(visaProxyFileName.toLowerCase()) > -1;
    if (flag) {
      const list = await papaParse(res);
      const ProList = list.map((item) => {
        return killProcess(item[1]);
      });
      await Promise.allSettled(ProList);
    }
    return Promise.resolve();
  } catch (error) {
    logError(`isRunningFn error: ${error}`);
    return Promise.reject(error);
  }
};
const runVisaExe = (port) => {
  return new Promise((resolve, reject) => {
    try {
      const child = childProcess.spawn(python_proxy_filename, [port], {
        detached: false,
      });
      child.stdout.on('data', (data) => {
        const output = data.toString();
        logInfo(`visa代理 Output: ${output}`);
        if (output.includes('Running')) {
          // 可以在这里执行后续逻辑
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
//默认端口
export default () => {
  return new Promise(async (resolve, reject) => {
    try {
      //如果他在运行,但是没有响应直接结束进程
      await isRunningFn();
      //启动exe
      const port = await portfinder.getPortPromise({
        port: defaultPort,
      });
      await runVisaExe(port);
      //启动之后
      electronStore.set('visaProxyPort', port);
      //获取授权
      await check_auth();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
