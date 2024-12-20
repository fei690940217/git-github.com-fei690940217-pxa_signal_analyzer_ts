/*
 * @Author: feifei
 * @Date: 2023-06-20 14:53:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:38:11
 * @FilePath: \pxa_signal_analyzer\src\main\utils\generateDocx\OBWHandle\index.ts
 * @Description:生成docx  officeGen版   (docx版本不支持2007)
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import fs from 'fs';
import path from 'path';
import { FullAbbreviationTable } from '@src/common';

import resultTableHandle from './resultTable';
import imgTableHandle from '../functionList/imgTable';
import { durationHandle, docGenerate } from '../functionList';
import emissionTable from './emissionTable';
// 其他docx生成
export default (testItem, resultList, baseURL, subProjectName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const startTime = '2023-10-20 14:57';
      const endTime = '2023-10-20 14:57';

      const doc = docGenerate(testItem);
      const newTestItem = FullAbbreviationTable[testItem];
      //结果表
      const resultTableData = await resultTableHandle(resultList);
      //截图表
      const imgTableData = await imgTableHandle(resultList, baseURL, testItem);
      //处理时间
      const duration = durationHandle(startTime, endTime);
      const tableData = {
        title: newTestItem,
        duration,
        resultData: resultTableData,
        imgData: imgTableData,
      };
      doc.render(tableData);
      const buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE',
      });
      const fileName = `${newTestItem}_${subProjectName}`;
      fs.writeFileSync(path.join(baseURL, `${fileName}.docx`), buf);
      await emissionTable(resultList, fileName, baseURL);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
