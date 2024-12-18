/*
 * @Author: feifei
 * @Date: 2023-06-20 14:53:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:19:33
 * @FilePath: \pxa_signal_analyzer\src\main\utils\generateDocx\otherHandle\index.js
 * @Description:生成docx  officeGen版   (docx版本不支持2007)
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

const fs = require('fs');
const path = require('path');
import { FullAbbreviationTable } from '@src/common/index.ts';

const resultTableHandle = require('./resultTable');
const imgTableHandle = require('../functionList/imgTable');
const { durationHandle, docGenerate } = require('../functionList');

// 其他docx生成
module.exports = (testItem, currentResult, baseURL, subProjectName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const startTime = '2023-10-20 14:57';
      const endTime = '2023-10-20 14:57';
      const doc = docGenerate(testItem);
      const newTestItem = FullAbbreviationTable[testItem];
      //结果表
      const resultTableData = await resultTableHandle(currentResult);
      //截图表
      const imgTableData = await imgTableHandle(
        currentResult,
        baseURL,
        testItem,
      );
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
        // compression: DEFLATE adds a compression step.
        // For a 50MB output document, expect 500ms additional CPU time
        compression: 'DEFLATE',
      });

      // buf is a nodejs Buffer, you can either write it to a
      // file or res.send it with express for example.
      // const time = format(new Date(), "dd_HH_mm");
      fs.writeFileSync(
        path.join(baseURL, `${newTestItem}_${subProjectName}.docx`),
        buf,
      );
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};
