/*
 * @Author: feifei
 * @Date: 2023-07-11 15:37:22
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:33:04
 * @FilePath: \pxa_signal_analyzer\src\main\utils\abortTest.ts
 * @Description: 用户主动结束测试
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { mainSendRender } from '@src/main/utils';
import dispatchAction from '@src/main/utils/dispatchAction';
import { getTestProcessInstance } from '@src/main/ipcMain/testProcess/TestProcessSingleton';
//结束测试
export default async (status) => {
  try {
    const testProcess = getTestProcessInstance();
    //如果是测试中,则kill测试进程
    if (testProcess) {
      testProcess.closeChildProcess();
      //通知渲染进程
      mainSendRender('processExit', status);
      //添加log
      let log = '';
      if (status === 'success') {
        log = `success_-_测试完成`;
      } else if (status === 'abort') {
        log = `warning_-_主动结束测试,测试已终止`;
      } else {
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
