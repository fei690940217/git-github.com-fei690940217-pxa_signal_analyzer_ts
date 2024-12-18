/*
 * @Author: feifei
 * @Date: 2023-07-12 16:07:11
 * @LastEditors: feifei
 * @LastEditTime: 2023-08-08 16:40:38
 * @FilePath: \fcc_5g_test_system\main\ipcMain\getLineLoss.js
 * @Description: 
 * 
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved. 
 */
const { ipcMain, shell, dialog } = require("electron");
const fsPromises = require("fs").promises;
const fs = require("fs");
const xlsx = require('node-xlsx').default;
module.exports = () => {
    return new Promise(async (resolve, reject) => {
        try {
            let rst = await dialog.showOpenDialog({
                title: '请选择文件',
                filters: [
                    { name: 'xlsx', extensions: ['xlsx'] },
                ]
            })
            const { canceled, filePaths } = rst
            //取消了
            if (canceled) {
                resolve({ type: 'canceled' })
            } else {
                //读表
                const filePath = filePaths[0]
                const workSheetsFromFile = xlsx.parse(filePath)
                resolve({ type: 'success', value: workSheetsFromFile })
            }
            return flag;
        } catch (error) {
            resolve({ type: 'error', msg: String(error) })
        }
    })
}
