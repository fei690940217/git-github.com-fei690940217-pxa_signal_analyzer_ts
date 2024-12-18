/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\appEventHandle\windowClose.js
 * @Author: xxx
 * @Date: 2023-05-12 17:16:38
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-09 17:42:55
 * @Descripttion: 监听窗口关闭事件,进行防呆
 */
const { ipcMain, dialog } = require("electron");
const { electronStore } = require("../publicData");
const { dispatchAction, mainSendRender } = require("../utils");
const { getTestProcessInstance } = require('../ipcMain/testProcess/TestProcessSingleton.js')
function fn(win) {
  win.on("close", (e) => {
    const isInProgress = electronStore.get("isInProgress");
    let res = dialog.showMessageBoxSync({
      title: "提示",
      message: isInProgress ? "测试正在进行,确定关闭应用吗" : "确定关闭应用?",
      type: "warning",
      buttons: ["取消", "确定"],
      cancelId: 0,
    });
    //取消
    if (res === 0) {
      e.preventDefault();
    }
    //确定关闭应用
    else {
      const testProcess = getTestProcessInstance()
      //如果是测试中,则kill测试进程
      if (testProcess) {
        const flag = testProcess.closeChildProcess();
        if (flag) {
          electronStore.set("isInProgress", false);
          if (electronStore.get("isTimeout")) {
            electronStore.set("isTimeout", false);
          }
          //通知渲染进程
          mainSendRender("processExit");
          //添加log
          dispatchAction({
            key: "addLog",
            value: `success_-_停止测试`,
          });
        }
      }
    }
  });
}
module.exports = fn;
