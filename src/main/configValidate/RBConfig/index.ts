/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\RBConfig\index.ts
 * @Author: xxx
 * @Date: 2023-04-06 10:24:55
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 10:21:28
 * @Descripttion:RB配置文件验证与生成
 */

import path from 'path';
import { appConfigFilePath } from '@src/main/publicData';
import XLSX from 'xlsx';
import { outputJson, pathExists } from 'fs-extra';
import { logError } from '@src/main/logger/logLevel';
import { xlsxDataArrayToObject, workbookNameHandle } from './util';
import mergeCellDataFill from '@src/main/utils/mergeCellDataFill';
import { RBConfigItem } from '@src/customTypes/main';
import { TestItemType } from '@src/customTypes/renderer';
const testItems: TestItemType[] = ['BandEdge', 'CSE', 'OBW', 'PAR'];
//RB配置文件地址
const configFilePath = path.join(appConfigFilePath, 'user/rbConfig');
//解析后存储地址
const rbConfigFilePath = path.join(appConfigFilePath, 'app/rbConfig');

//测试用例
const readXlsx = async (testItem: string, isRefresh: boolean) => {
  try {
    //储存本地app/config
    const saveFilePath = path.join(rbConfigFilePath, `${testItem}.json`);
    if (!isRefresh) {
      const flag = await pathExists(saveFilePath);
      if (flag) {
        return Promise.resolve();
      }
    }
    const OriginalFilePath = path.join(configFilePath, `${testItem}.xlsx`);
    //文件存在
    const flag = await pathExists(OriginalFilePath);
    if (!flag) {
      //文件不存在>不做处理
      logError(`user/rbConfig/${testItem}表不存在,请检查Rb配置表是否齐全`);
      return;
    }
    let RESULT: RBConfigItem[] = [];
    const wb = XLSX.readFile(OriginalFilePath);
    //判断文件是否存在
    const { Sheets, Workbook } = wb;
    if (!Workbook) {
      return;
    }
    const { Sheets: WorkbookSheets } = Workbook;
    if (!WorkbookSheets) {
      return;
    }
    for (const sheetItem of WorkbookSheets) {
      const { name, Hidden } = sheetItem;
      const SCS = workbookNameHandle(name);
      if (Hidden === 1 || !name || !SCS) {
        continue;
      }
      const sheet = Sheets[name];
      const merges = sheet['!merges'];
      const json = XLSX.utils.sheet_to_json<any[][]>(sheet, {
        range: 0,
        header: 1,
        defval: '',
        raw: false, // 禁用原始文本模式
        // blankrows: false, // 不忽略空行
      });
      //mergeCellDataFill,填充合并单元格
      const fillJson = mergeCellDataFill(merges, json);
      //处理数据
      const newJson = xlsxDataArrayToObject(fillJson, 1, SCS, testItem);
      RESULT = RESULT.concat(newJson);
    }
    await outputJson(saveFilePath, RESULT);
    return;
  } catch (error) {
    const msg = `ces limit 配置文件验证失败,请检查 ${error}`;
    logError(msg);
  }
};

export default async (isRefresh: boolean = false) => {
  try {
    const proList = testItems.map((testItem) => {
      //读表
      return readXlsx(testItem, isRefresh);
    });
    await Promise.allSettled(proList);
  } catch (error) {
    logError(error?.toString() + 'rbConfig生成失败' || 'rbConfig生成失败');
  }
};
