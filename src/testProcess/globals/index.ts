/*
 * @Author: feifei
 * @Date: 2024-12-10 16:08:53
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 17:08:12
 * @FilePath: \pxa_signal_analyzer\src\testProcess\globals\index.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

//  SharedParameters.set('projectName', parentProjectName);
//  SharedParameters.set('subProjectName', subProjectName);
//  SharedParameters.set('currentSelectedItem', currentSelectedItem);
//  //频谱线损
//  const spectrumLineLoss = electronStore.get('spectrumLineLoss');
//  SharedParameters.set('spectrumLineLoss', spectrumLineLoss);
//  //频谱配置
//  const spectrumConfig = electronStore.get('spectrumConfig');
//  SharedParameters.set('spectrumConfig', spectrumConfig);

class SharedParameters {
  private data: Record<string, any>; // 使用 Record 来定义 data 类型
  constructor() {
    this.data = {}; // 存储共享数据的对象
  }

  // 获取指定键的数据
  get(key: string) {
    return this.data[key];
  }

  // 设置指定键的数据
  set(key: string, value: any) {
    this.data[key] = value;
  }

  // 获取所有数据的副本
  getAll() {
    return { ...this.data };
  }

  // 删除指定键的数据
  remove(key: string) {
    delete this.data[key];
  }

  // 清空所有数据
  clear() {
    this.data = {};
  }
}

// 导出单例
export default new SharedParameters();
