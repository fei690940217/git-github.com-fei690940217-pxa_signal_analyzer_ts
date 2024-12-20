/*
 * @Author: feifei
 * @Date: 2023-06-20 14:53:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:34:43
 * @FilePath: \pxa_signal_analyzer\src\main\utils\generateDocx\index.ts
 * @Description:生成docx  officeGen版   (docx版本不支持2007)
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import path from 'path';
import dispatchAction from '@src/main/utils/dispatchAction';
import { appConfigFilePath } from '@src/main/publicData';
//其他用例
import otherDocxGenerate from './otherHandle';
//OBW专用
import OBWGenerateXLSX from './OBWHandle';
import { readJson } from 'fs-extra';
import { logError, logInfo } from '@src/main/logger/logLevel';

export default async (params) => {
  try {
    const { projectName, subProjectName } = params;
    logInfo(`开始生成报告 ${projectName}/${subProjectName}`);
    const baseURL = path.join(
      appConfigFilePath,
      'user/project',
      projectName,
      subProjectName,
    );
    const filePath = path.join(baseURL, 'result.json');
    const currentResult = await readJson(filePath);
    const testItem = currentResult[0].testItem;
    //获取测试结果
    if (!currentResult?.length) return;
    //添加log
    dispatchAction({
      key: 'addLog',
      value: `${projectName}/${subProjectName} 开始生成报告`,
    });

    if (testItem === 'OBW') {
      await OBWGenerateXLSX(testItem, currentResult, baseURL, subProjectName);
    } else {
      await otherDocxGenerate(testItem, currentResult, baseURL, subProjectName);
    }
    //添加log
    dispatchAction({
      key: 'addLog',
      value: `success_-_${projectName}/${subProjectName} 报告已生成生成`,
    });
    return Promise.resolve();
  } catch (error) {
    logError(`${subProjectName} 生成报告出错 ${error.toString()}`);
    dispatchAction({
      key: 'addLog',
      value: `error_-_ ${subProjectName} 生成报告出错 ${error.toString()}`,
    });
    return Promise.reject(error);
  }
};
