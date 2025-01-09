/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\index.ts
 * @Author: xxx
 * @Date: 2023-04-07 14:24:23
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 17:53:36
 * @Descripttion:   测试用例数据验证与配置文件生成
 */

import configData from './NR_ARFCN';
import rbConfigData from './RBConfig';
import authTypeObj from './NR_Band_List';
import LTE_Band_List from './LTE_Band_List';
import LTE_ARFCN from './LTE_ARFCN';
import BandEdgeLimit from './bandEdgeLimit';
import CSELimit from './CSELimit';
import RBConfigSelectedList from './RBConfigSelectedList';
import { logError } from '../logger/logLevel';

//参数:window实例
//isRefresh 判断是否是更新配置,如果是更新配置则全部重新生成,如果不是更新配置则只更新部分配置
export default async (isRefresh: boolean = false) => {
  try {
    await LTE_Band_List(isRefresh);
    LTE_ARFCN(isRefresh);
    BandEdgeLimit(isRefresh);
    CSELimit(isRefresh);
    //生成FCC,ce,telec 对应的band列表
    await authTypeObj(isRefresh);
    //生成RB配置文件
    rbConfigData(isRefresh);
    //验证通过>生成json形式的配置表存储在本地
    configData(isRefresh);
    //
    RBConfigSelectedList(isRefresh);
  } catch (error) {
    logError(error?.toString() + '配置文件生成失败 42' || '配置文件生成失败');
  }
};
