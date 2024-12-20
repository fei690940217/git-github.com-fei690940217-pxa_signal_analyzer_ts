/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\util.ts
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:20:54
 * @Descripttion: 全测函数
 */
import jsonfile from 'jsonfile';
import { appConfigFilePath } from '@src/main/publicData';
import path from 'path';

//获取结果路径
export const getResultFilePath = (parentProjectName, subProjectName) => {
  const resultFilePath = path.join(
    appConfigFilePath,
    'user/project',
    parentProjectName,
    subProjectName,
    'result.json',
  );
  return resultFilePath;
};
//单条测试结果更新
export const refreshResult = (id, result, resultFilePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      //获取测试需测试的条目
      const currentResult = await jsonfile.readFile(resultFilePath);
      let tempResult = currentResult.map((item) => {
        if (item.id === id) {
          item.result = result;
        }
        return item;
      });
      await jsonfile.writeFile(resultFilePath, tempResult);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
