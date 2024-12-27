/*
 * @Author: feifei
 * @Date: 2023-07-12 16:07:11
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 10:35:11
 * @FilePath: \pxa_signal_analyzer\src\main\ipcMain\getLineLoss.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { ipcMain, shell, dialog } from 'electron';
import XLSX from 'xlsx';
const fsPromises = require('fs').promises;
import fs from 'fs';
const xlsx = require('node-xlsx').default;

export default () => {
  return new Promise(async (resolve, reject) => {
    try {
      let rst = await dialog.showOpenDialog({
        title: '请选择文件',
        filters: [{ name: 'xlsx', extensions: ['xlsx'] }],
      });
      const { canceled, filePaths } = rst;
      //取消了
      if (canceled) {
        resolve({ type: 'canceled' });
      } else {
        //读表
        const filePath = filePaths[0];
        const workSheetsFromFile = xlsx.parse(filePath);
        resolve({ type: 'success', value: workSheetsFromFile });
      }
    } catch (error) {
      resolve({ type: 'error', msg: String(error) });
    }
  });
};
