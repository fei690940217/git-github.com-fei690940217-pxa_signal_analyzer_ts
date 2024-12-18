/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\testProcess\testIndex\util.js
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 16:53:49
 * @Descripttion: 全测函数
 */
const jsonfile = require('jsonfile')
const { appConfigFilePath } = require("../../main/publicData");
const path = require("path");

//获取结果路径
exports.getResultFilePath = (parentProjectName, subProjectName) => {
    const resultFilePath = path.join(
        appConfigFilePath,
        "user/project",
        parentProjectName,
        subProjectName,
        "result.json"
    );
    return resultFilePath;
};
//单条测试结果更新  
exports.refreshResult = (id, result, resultFilePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            //获取测试需测试的条目
            const currentResult = await jsonfile.readFile(resultFilePath)
            let tempResult = currentResult.map((item) => {
                if (item.id === id) {
                    item.result = result;
                }
                return item
            });
            await jsonfile.writeFile(resultFilePath, tempResult)
            resolve();
        } catch (error) {
            reject(error);
        }
    });
};
