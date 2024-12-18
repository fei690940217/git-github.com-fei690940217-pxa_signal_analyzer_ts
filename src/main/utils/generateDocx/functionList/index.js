/*
 * @Author: feifei
 * @Date: 2023-06-20 14:53:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-01-22 16:51:12
 * @FilePath: \fcc_5g_test_system\main\utils\generateDocx\functionList\index.js
 * @Description:生成docx  officeGen版   (docx版本不支持2007)
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

const fs = require("fs");
const fsPromises = require("fs").promises;
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const ImageModule = require("docxtemplater-image-module-free");
const path = require("path");
const { differenceInMinutes } = require("date-fns");
const { appConfigFilePath } = require("../../../publicData");
//处理时间  `总时长2h(2023/7/27 10:00～2023/7/27 12:00)`
exports.durationHandle = (startTime, endTime) => {
  if (startTime && endTime) {
    const start = new Date(startTime);
    const end = new Date(endTime); //
    const timeDiffInMinutes = differenceInMinutes(end, start);
    if (isNaN(timeDiffInMinutes)) {
      return "";
    } else {
      if (timeDiffInMinutes < 60) {
        if (timeDiffInMinutes <= 0) {
          return `测试时长 1分钟 (${startTime}~${endTime})`;
        } else {
          return `测试时长 ${timeDiffInMinutes}分钟 (${startTime}~${endTime})`;
        }
      } else {
        const hours = Math.floor(timeDiffInMinutes / 60);
        const minutes = timeDiffInMinutes % 60;
        if (minutes) {
          return `测试时长 ${hours}小时 (${startTime}~${endTime})`;
        } else {
          return `测试时长 ${hours}小时${minutes}分钟 (${startTime}~${endTime})`;
        }
      }
    }
  } else {
    return "";
  }
};
//加载模板,生成docx
exports.docGenerate = (testItem) => {
  let tempTestItem = testItem;
  if (testItem === "BandEdgeIC") {
    tempTestItem = "BandEdge";
  }
  const filePath = path.join(
    appConfigFilePath,
    "user/report-template",
    `${tempTestItem}-template.docx`
  );
  const imageOptions = {
    centered: true,
    getImage(tagValue, tagName) {
      return fs.readFileSync(tagValue);
    },
    getSize() {
      // it also is possible to return a size in centimeters, like this : return [ "2cm", "3cm" ];
      return [280, 230];
    },
  };
  //加载模板
  let content = fs.readFileSync(filePath, "binary");
  const zip = new PizZip(content);
  //以模板创建docx
  const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
    modules: [new ImageModule(imageOptions)],
  });
  return doc;
};
//band处理函数,nsa需要加let_Band
exports.bandGenerate = (record) => {
  const { Band, LTE_Band, networkMode } = record;
  const isNSA = networkMode === "NSA";
  if (isNSA) {
    const newLTE = LTE_Band.substring(1) + "A";
    return isNSA ? `${newLTE}_${Band}` : Band;
  } else {
    return Band;
  }
};
