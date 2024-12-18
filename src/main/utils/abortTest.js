/*
 * @Author: feifei
 * @Date: 2023-07-11 15:37:22
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 10:08:52
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\utils\abortTest.js
 * @Description: 用户主动结束测试
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const { mainSendRender } = require("./index");
const dispatchAction = require("./dispatchAction.js");
const { getTestProcessInstance } = require("../ipcMain/testProcess/TestProcessSingleton.js");
//结束测试
module.exports = async (status) => {
    try {
        const testProcess = getTestProcessInstance()
        //如果是测试中,则kill测试进程
        if (testProcess) {
            testProcess.closeChildProcess()
            //通知渲染进程
            mainSendRender("processExit", status);
            //添加log
            let log = ''
            if (status === 'success') {
                log = `success_-_测试完成`
            }
            else if (status === 'abort') {
                log = `warning_-_主动结束测试,测试已终止`
            }
            else {
                log = `error_-_测试过程出错,测试已结束`
            }
            dispatchAction({
                key: "addLog",
                value: log,
            });
        }
    } catch (error) {
        //添加log
        dispatchAction({
            key: "addLog",
            value: `error_-_${String(error)}`,
        });
    }
};
