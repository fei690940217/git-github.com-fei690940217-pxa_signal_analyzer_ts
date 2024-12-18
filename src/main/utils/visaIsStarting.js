/*
 * @Author: feifei
 * @Date: 2024-12-05 17:29:14
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 10:36:47
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\utils\visaIsStarting.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
const Papa = require('papaparse');
const childProcess = require("child_process");
const { appConfigFilePath, visaProxyFileName } = require("../publicData");
const { get_instr_list } = require('../api/api.js')
const { logError, logInfo } = require('../logger/logLevel.js')

//寻找进程的指令
const command = `tasklist /FO CSV | findstr /i "visa_proxy_only_spectrum"`
const papaParse = (csvData) => {
    return new Promise((resolve, reject) => {
        try {
            // 使用 Papa.parse 解析 CSV 数据
            Papa.parse(csvData, {
                delimiter: ',',  // CSV 文件的分隔符，默认是逗号
                header: false,   // 不需要第一行作为头部（如果需要头部，可以设置为 true）
                dynamicTyping: true, // 自动将数字转换为数字类型
                skipEmptyLines: true, // 跳过空行
                complete: function (results) {
                    resolve(results.data)
                }
            });
        } catch (error) {
            logError(`papaParse 解析 csv 文件失败：${error}`)
            reject(error)
        }

    })

}
//是否响应
const isResponse = async () => {
    try {
        const res = await get_instr_list()
        return true
    } catch (error) {
        logError(`isResponse get_instr_list error：${error}`)
        return false
    }
}
//从进程看是否启动
const isRunningFn = () => {
    try {
        let res = childProcess.execSync(command, { encoding: "utf-8" });
        const flag = res.toLowerCase().indexOf(visaProxyFileName.toLowerCase()) > -1;
        return flag;
    } catch (error) {
        logError(`isRunningFn  childProcess.execSync error：${error}`)
    }

};
//获取pid
const getPid = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let tasklistOutput = childProcess.execSync(command, { encoding: "utf-8" });
            const lines = await papaParse(tasklistOutput)
            let pidList = lines.map(item => {
                return item[1]
            })
            resolve(pidList)
        } catch (error) {
            reject(error)
        }

    })
}
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
            logError(`killProcess  childProcess.execSync error：${error}`)
            reject(error)
        }
    })
}
module.exports = async () => {
    try {
        //如果他在运行,但是没有响应直接结束进程
        const isRunning = isRunningFn();
        //如果进程都没有启动,直接返回false
        if (!isRunning) {
            return Promise.resolve(false)
        }
        //接着判断visa是否响应,如果响应直接返回true
        const isResponseFlag = await isResponse()
        if (isResponseFlag) {
            return Promise.resolve(true)
        } else {
            const pidList = await getPid()
            //如果visaProxy正在运行 kill
            if (pidList?.length) {
                await killProcess(pidList)
            }
            return Promise.resolve(false)
        }
    } catch (error) {
        logError(`visaIsStarting 114  error：${error}`)
        return false
    }
}