/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\main\configValidate\LTE_Band_List.js
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-12 10:08:12
 * @Descripttion:CSE limit与Band对照表
 */

const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");
const { appConfigFilePath } = require("../publicData");
const xlsx = require("node-xlsx").default;
const { outputJson, pathExists } = require("fs-extra");
const { logError } = require("../logger/logLevel");

//配置文件地址 源文件
const configFilePath = path.join(
    appConfigFilePath,
    "user/operating bands/LTE_Band.xlsx"
);
//写入本地 解析后写入本地
const filePath = path.join(appConfigFilePath, "app/LTE_Band_List.json");
module.exports = async (isRefresh) => {
    try {
        //如果是刷新则直接重新生成
        if (!isRefresh) {
            const flag = await pathExists(filePath);
            if (flag) {
                return Promise.resolve();
            }
        }
        const reg = /[\t\r\f\n\s]*/g;
        const resultList = [];
        //判断文件是否存在
        await fsPromises.access(configFilePath);
        const workSheetsList = xlsx.parse(configFilePath);
        const { name, data } = workSheetsList[0];
        //去掉表头
        const newWorksheet = data.slice(1);
        //生成表名
        for (let item of newWorksheet) {
            // duplexMode双工模式 TDD/FDD
            const [tempBand, FL, FH, duplexMode] = item;
            //去空格
            if (!tempBand) {
                break;
            }
            const Band = tempBand.replace(reg, "");
            resultList.push({
                Band,
                FL,
                FH,
                duplexMode,
            });
        }
        await outputJson(filePath, resultList);
        return Promise.resolve();
    } catch (error) {
        logError(error.toString());
        return Promise.reject();
    }
};
