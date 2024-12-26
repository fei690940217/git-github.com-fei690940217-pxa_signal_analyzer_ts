/*
 * @FilePath: \pxa_signal_analyzer\src\main\configValidate\index.ts
 * @Author: xxx
 * @Date: 2023-04-07 14:24:23
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-25 13:18:03
 * @Descripttion:   测试用例数据验证与配置文件生成
 */

import configData from './NR_ARFCN';
import rbConfigData from './RBConfig';
import authTypeObj from './NR_Band_List';
import LTE_Band_List from './LTE_Band_List';
import LTE_ARFCN from './LTE_ARFCN';
import bandedgeLimit from './bandEdge/bandedgeLimit';
import bandedgeLimitGate from './bandEdge/bandedgeLimitGate';
import bandedgeLimitIC from './bandEdge/bandedgeICLimit';

import CSELimit from './CSELimit';
import { logError } from '../logger/logLevel';

//参数:window实例
//isRefresh 判断是否是更新配置,如果是更新配置则全部重新生成,如果不是更新配置则只更新部分配置
export default async (isRefresh: boolean = false) => {
  try {
    await LTE_Band_List(isRefresh);
    LTE_ARFCN(isRefresh);
    //normal
    bandedgeLimit(isRefresh);
    //gate
    bandedgeLimitGate(isRefresh);
    //IC
    bandedgeLimitIC(isRefresh);
    CSELimit(isRefresh);
    //生成FCC,ce,telec 对应的band列表
    await authTypeObj(isRefresh);
    //生成RB配置文件
    rbConfigData(isRefresh);
    //验证通过>生成json形式的配置表存储在本地
    configData(isRefresh);
  } catch (error) {
    logError(error?.toString() + '配置文件生成失败 42' || '配置文件生成失败');
  }
};
