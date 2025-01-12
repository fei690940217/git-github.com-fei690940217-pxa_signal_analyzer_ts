/*
 * @Author: feifei
 * @Date: 2024-12-05 17:43:23
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-12 11:58:17
 * @FilePath: \pxa_signal_analyzer_ts\src\main\utils\runVisaProxy.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { visaProxyFileName, defaultPort } from '@src/common';

import { check_auth } from '@src/main/api/api';
import visaIsStarting from './visaIsStarting';
import electronStore from '@src/main/electronStore';

import { appConfigFilePath } from '../publicData';
import { delayTime, mainSendRender } from './index';
import path from 'path';
import childProcess from 'child_process';
import type { ChildProcess } from 'child_process';
import { pathExists } from 'fs-extra';
//判断端口可用情况,如果不可用会返回一个可用端口
import portfinder from 'portfinder';
const python_proxy_filename = path.join(
  appConfigFilePath,
  'app/visaProxy',
  visaProxyFileName,
);

//默认端口
export default () => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      //是否正在运行
      let flag = await visaIsStarting();
      if (flag) {
        resolve();
      } else {
        const python_proxy_flag = await pathExists(python_proxy_filename);
        if (!python_proxy_flag) return;
        const port = await portfinder.getPortPromise({
          port: defaultPort,
        });

        const child: ChildProcess = childProcess.spawn(
          python_proxy_filename,
          [port.toString()],
          {
            detached: false,
          },
        );
        //如果启动成功
        if (child.pid) {
          electronStore.set('visaProxyPort', port);
          //成功之后需要获取授权,等待5000
          await delayTime(3000);
          let rst = null;
          try {
            rst = await check_auth();
          } catch (error) {
            mainSendRender('noAuthentication', {
              message: `授权出错,请重试`,
              description: error,
            });
          }
          if (rst) {
            mainSendRender('noAuthentication', {
              message: `授权码 ${rst}`,
              description: '授权未通过,请联系管理员授权',
            });
          }

          resolve();
        } else {
          electronStore.set('visaProxyPort', null);
          reject(new Error('visa启动失败'));
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
