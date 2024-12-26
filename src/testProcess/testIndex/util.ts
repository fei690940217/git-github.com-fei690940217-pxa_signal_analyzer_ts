/*
 * @FilePath: \pxa_signal_analyzer\src\testProcess\testIndex\util.ts
 * @Author: xxx
 * @Date: 2023-05-08 15:48:20
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 16:42:31
 * @Descripttion: 全测函数
 */
import { outputJSON, readJson, writeJson } from 'fs-extra';
import { appConfigFilePath } from '@src/main/publicData';
import path from 'path';
import { ResultItemType } from '@src/customTypes/renderer';
//获取结果路径
export const getResultFilePath = (
  parentProjectName: string,
  subProjectName: string,
) => {
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
export const refreshResult = (
  id: number,
  result: string,
  resultFilePath: string,
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      //获取测试需测试的条目
      const currentResult: ResultItemType[] = await readJson(resultFilePath);
      let tempResult = currentResult.map((item) => {
        if (item.id === id) {
          item.result = result;
        }
        return item;
      });
      await writeJson(resultFilePath, tempResult);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
