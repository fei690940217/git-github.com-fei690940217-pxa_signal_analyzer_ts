/*
 * @Author: feifei
 * @Date: 2024-02-08 10:53:04
 * @LastEditors: feifei
 * @LastEditTime: 2024-02-08 11:48:57
 * @FilePath: \5G_TELEC_TEST\src\renderer\components\NotificationApi.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
// globals.ts

import {
  ArgsProps,
  NotificationInstance,
} from 'antd/es/notification/interface';

class SharedParameters {
  private NotificationApi: NotificationInstance | null = null;
  constructor() {
    this.NotificationApi = null;
  }
  get(): NotificationInstance | null {
    return this.NotificationApi;
  }
  set(value: NotificationInstance | null): void {
    this.NotificationApi = value;
  }
  open(config: ArgsProps) {
    this.NotificationApi?.open(config);
  }
  success(config: ArgsProps) {
    this.NotificationApi?.open(config);
  }
  error(config: ArgsProps) {
    this.NotificationApi?.open(config);
  }
  info(config: ArgsProps) {
    this.NotificationApi?.open(config);
  }
  warning(config: ArgsProps) {
    this.NotificationApi?.open(config);
  }
}

// 使用字符串作为参数值的默认类型
export default new SharedParameters();
