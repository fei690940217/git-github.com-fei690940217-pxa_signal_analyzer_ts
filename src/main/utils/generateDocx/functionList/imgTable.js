/*
 * @Author: feifei
 * @Date: 2023-06-20 14:55:19
 * @LastEditors: feifei
 * @LastEditTime: 2023-10-16 14:08:29
 * @FilePath: \fcc_5g_test_system\main\utils\generateDocx\functionList\imgTable.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const { chunk } = require("lodash");
const { bandGenerate } = require('../functionList/index')
const { logError, logInfo } = require('../../../logger/logLevel')

//CSE专用
const rangeColumnRender = (rangeStart, rangeStop) => {
  if (rangeStart && rangeStop) {
    let start = null;
    if (rangeStart >= 1000) {
      start = rangeStart / 1000 + "GHz";
    } else {
      start = rangeStart + "MHz";
    }
    let stop = null;
    if (rangeStop >= 1000) {
      stop = rangeStop / 1000 + "GHz";
    } else {
      stop = rangeStop + "MHz";
    }
    return `${start}-${stop}`;
  } else {
    return "";
  }
};
// 文本类 tableCell生成
const imageObjGenerate = (item, baseURL) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { testItem, modulate, OFDM, RB, BW, level, id, rangeStart, rangeStop } = item;
      const newBand = bandGenerate(item)
      const ofdm = OFDM === "DFT" ? "DFT-s-OFDM" : "CP-OFDM";
      const modulation = `${ofdm} ${modulate}`;
      let title = ''
      if (testItem === 'CSE') {
        const range = rangeColumnRender(rangeStart, rangeStop)
        title = `${newBand} (${range}) ${BW}M ${modulation} ${RB} ${level}`;
      } else {
        title = `${newBand} ${BW}M ${modulation} ${RB} ${level}`;
      }
      const imgPath = path.join(baseURL, `${id}.png`);
      //判断图片是否存在
      try {
        await fsPromises.access(imgPath);
        resolve({ title, imgPath })
      } catch (error) {
        resolve({ title, imgPath: '' })
      }
    } catch (error) {
      reject(error)
    }
  })

};

//图片表格数据生成
const imageTableDataGenerate = (list, faBaseURL) => {
  return new Promise(async (resolve, reject) => {
    try {
      const baseURL = path.join(faBaseURL, "img");
      let rows = [];
      const resultList = chunk(list, 2);
      for (let [firstItem, secondItem] of resultList) {
        try {
          let row = {}
          const { title: firstTitle, imgPath: firstImgPath } = await imageObjGenerate(firstItem, baseURL);
          if (secondItem) {
            const { title: secondTitle, imgPath: secondImgPath } = await imageObjGenerate(secondItem, baseURL)
            row = { firstTitle, firstImgPath, secondTitle, secondImgPath };
          } else {
            row = { firstTitle, firstImgPath, secondTitle: 'N/A', secondImgPath: '' };
          }
          rows.push(row);
        } catch (error) {
          logError(`imageTableDataGenerate error 89: ${error}`)
          break;
        }
      }
      resolve(rows);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = (list, faBaseURL) => {
  return new Promise(async (resolve, reject) => {
    try {
      const table = await imageTableDataGenerate(list, faBaseURL)
      resolve(table)
    } catch (error) {
      reject(error);
    }
  });
};
