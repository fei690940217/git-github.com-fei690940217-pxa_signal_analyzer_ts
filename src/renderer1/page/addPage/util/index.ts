/*
 * @Author: feifei
 * @Date: 2024-12-30 15:17:29
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 15:52:24
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\util\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { evaluate } from 'mathjs';
import $moment from 'moment';

import {
  BandItemInfo,
  NewAddFormValueType,
  ProjectItemType,
} from '@src/customTypes/renderer';
import { nanoid } from 'nanoid';
const { ipcRenderer } = window.myApi;

//判断公式的正则
const expressionRegex = /[\+\-\*/]/;
//判断变量的正则
const variableRegex = /^[A-Za-z_][A-Za-z0-9_]*$/;

//判断表格数据的类型 数字,计算公式,单变量,无效
export const determineType = (value: any) => {
  //先判断是不是数字,如果是数字直接返回数字
  if (!isNaN(value)) {
    return 'Number';
  } else if (variableRegex.test(value)) {
    return 'Variable';
  } else if (expressionRegex.test(value)) {
    return 'Expression';
  } else {
    return 'Unknown';
  }
};
//本函数需要返回
// {
//   "no": 3,
//   "start": ["FL-BW", "FL-1", "FL"],
//   "stop": ["FL-1", "FL", "FL+BW"],
//   "RBW": [1000, 30, 1000],
//   "VBW": [3000, 90, 3000],
//   "limit": [-13, -13, 40]
// }
//循环处理 start,stop,RBW,VBW   subItem:提供变量使用
export const loopFn = (list, subItem) => {
  return list.map((item) => {
    const type = determineType(item);
    //数字
    if (type === 'Number') {
      return item;
    }
    //单变量
    else if (type === 'Variable') {
      return subItem[item];
    }

    //计算公式
    else if (type === 'Expression') {
      const { FL, FH, BW, DLFreq: CF } = subItem;
      const params = {
        FL,
        FH,
        BW,
        CF,
      };
      const result = Number(evaluate(item, params).toFixed(2));
      return result;
    }
    //无效字符
    else if (type === 'Unknown') {
      return '';
    }
  });
};

//ipcMainMod1Handle,getProjectInfo
type getProjectInfoPayloadType = {
  dirName: string;
  subProjectName: string;
};
export const getProjectInfo = async (payload: getProjectInfoPayloadType) => {
  try {
    console.log('准备获取项目信息');
    const list = await ipcRenderer.invoke<ProjectItemType>(
      'ipcMainMod1Handle',
      { action: 'getProjectInfo', payload },
    );
    return list;
  } catch (error) {
    console.error(error);
    return null;
  }
};

//生成新的当前行数据
export const projectInfoGen = (
  isAdd: boolean,
  formValue: NewAddFormValueType,
  projectInfo: ProjectItemType | null,
) => {
  if (isAdd) {
    //给projectList.json中添加本项目
    const projectObj = {
      id: nanoid(8),
      createDate: $moment().format('YYYY-MM-DD HH:mm'),
      updateDate: null,
      ...formValue,
    };
    return projectObj;
  }
  //编辑
  else {
    const projectObj = {
      id: projectInfo?.id ?? nanoid(8),
      createDate:
        projectInfo?.createDate ?? $moment().format('YYYY-MM-DD HH:mm'),
      updateDate: $moment().format('YYYY-MM-DD HH:mm'),
      ...formValue,
    };
    return projectObj;
  }
};
