/*
 * @FilePath: \pxa_signal_analyzer\src\main\appEventHandle\windowClose.ts
 * @Author: xxx
 * @Date: 2023-05-12 17:16:38
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:55:13
 * @Descripttion: 监听窗口关闭事件,进行防呆
 */
import { ipcMain, dialog } from 'electron';
import electronStore from '@src/main/electronStore';
import { dispatchAction, mainSendRender } from '../utils';
import { getTestProcessInstance } from '../ipcMain/testProcess/TestProcessSingleton';
export default function fn(win) {
  win.on('close', (e) => {
    const isInProgress = electronStore.get('isInProgress');
    let res = dialog.showMessageBoxSync({
      title: '提示',
      message: isInProgress ? '测试正在进行,确定关闭应用吗' : '确定关闭应用?',
      type: 'warning',
      buttons: ['取消', '确定'],
      cancelId: 0,
    });
    //取消
    if (res === 0) {
      e.preventDefault();
    }
    //确定关闭应用
    else {
      const testProcess = getTestProcessInstance();
      //如果是测试中,则kill测试进程
      if (testProcess) {
        const flag = testProcess.closeChildProcess();
        if (flag) {
          electronStore.set('isInProgress', false);
          if (electronStore.get('isTimeout')) {
            electronStore.set('isTimeout', false);
          }
          //通知渲染进程
          mainSendRender('processExit');
          //添加log
          dispatchAction({
            key: 'addLog',
            value: `success_-_停止测试`,
          });
        }
      }
    }
  });
}
