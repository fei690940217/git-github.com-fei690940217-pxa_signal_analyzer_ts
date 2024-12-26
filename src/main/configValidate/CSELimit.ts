/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\CSELimit.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 11:03:08
 * @Descripttion: 新建项目时进行配置文件验证,防止配置文件
 */
import XLSX from 'xlsx';
import path from 'path';
import { appConfigFilePath } from '../publicData';
import { outputJson, pathExists, readJson } from 'fs-extra';
import { logError } from '../logger/logLevel';
import { CSELimitItemType } from '@src/customTypes/main';
//配置文件地址
const configFilePath = path.join(
  appConfigFilePath,
  `user/limitConfig/CSE limit.xlsx`,
);
// 写入本地
const resultconfigFilePath = path.join(appConfigFilePath, `app/CSELimit.json`);
//按照RB level,BW相同的原则分组
const dataHandle = (list: CSELimitItemType[]) => {
  const result: Record<string, CSELimitItemType[]> = list.reduce<
    Record<string, CSELimitItemType[]>
  >((acc, item) => {
    const Band = item.Band;
    // 如果 acc 对象中已有 Band 对应的数组，则直接添加到数组中
    // 否则，创建一个新的数组
    acc[Band] = acc[Band] ? [...acc[Band], item] : [item];
    return acc;
  }, {});
  for (const band in result) {
    if (result.hasOwnProperty(band)) {
      if (result[band].length > 1) {
        // 对数组按照 rangeStop 进行排序
        result[band].sort(
          (a, b) => parseFloat(a.rangeStop) - parseFloat(b.rangeStop),
        );
        // 为每个对象添加段数属性
        result[band].forEach((item, index) => {
          item.segmentNumber = index + 1;
        });
      }
    }
  }
  return result;
};

export default async (isRefresh: boolean) => {
  try {
    if (!isRefresh) {
      const flag = await pathExists(resultconfigFilePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const header = [
      'Band',
      'rangeStart',
      'rangeStop',
      'RBW',
      'VBW',
      'CSE_Limit',
      'atten',
    ];
    const wb = XLSX.readFile(configFilePath);
    //判断文件是否存在
    const { Sheets, SheetNames } = wb;
    const sheet = Sheets[SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<CSELimitItemType>(sheet, {
      range: 1,
      header,
      defval: '',
      raw: false, // 禁用原始文本模式
      // blankrows: false, // 不忽略空行
    });
    const newJson = dataHandle(json);
    await outputJson(resultconfigFilePath, newJson);
  } catch (error) {
    const msg = `ces limit 配置文件验证失败,请检查 ${error}`;
    logError(msg);
  }
};
