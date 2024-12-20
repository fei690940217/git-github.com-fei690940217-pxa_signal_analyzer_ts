/*
 * @Author: feifei
 * @Date: 2023-06-20 14:53:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 13:43:30
 * @FilePath: \pxa_signal_analyzer\src\main\utils\generateDocx\OBWHandle\emissionExcel.ts
 * @Description: 生成docx  插件:node-xlsx   (docx版本不支持2007)
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

export default (worksheet, mergeList) => {
  //设置单元格宽度
  worksheet.columns = [
    { width: 15 },
    { width: 15 },
    { width: 15 },
    { width: 20 },
  ];
  //设置文字居中
  for (let num of [1, 2, 3, 4]) {
    worksheet.getColumn(num).alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  }
  //开始循环表
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    //添加边框
    row.eachCell((cell, colNumber) => {
      //设置边框
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
      cell.font = {
        name: 'Arial',
        family: 4,
        size: 11,
        bold: false,
      };
    });
    //合并Band 表头
    const secondCellValue = row.getCell(2).value;
    if (secondCellValue === 'headerColumn') {
      //(开始行，开始列，结束行，结束列)
      worksheet.mergeCells(rowNumber, 1, rowNumber, 4);
    }
    //计算哪些bW需要合并
  });
  for (let item of mergeList) {
    worksheet.mergeCells(item);
  }
};
