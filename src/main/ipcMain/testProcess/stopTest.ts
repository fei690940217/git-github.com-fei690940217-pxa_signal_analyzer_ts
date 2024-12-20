/*
 * @Author: feifei
 * @Date: 2023-07-11 15:37:22
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:51:16
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\testProcess\stopTest.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import dispatchAction from '@src/main/utils/dispatchAction';
import { mainSendRender } from '@src/main/utils';

//结束测试
export default async (status, testProcess) => {
  try {
    //如果是测试中,则kill测试进程
    if (testProcess) {
      testProcess.closeChildProcess();
      //通知渲染进程
      mainSendRender('processExit', status);
      //添加log
      let log = '';
      if (status === 'success') {
        log = `success_-_测试完成`;
      } else if (status === 'error') {
        log = `error_-_测试过程出错,测试已结束`;
      }
      dispatchAction({
        key: 'addLog',
        value: log,
      });
    }
  } catch (error) {
    //添加log
    dispatchAction({
      key: 'addLog',
      value: `error_-_${String(error)}`,
    });
  }
};
