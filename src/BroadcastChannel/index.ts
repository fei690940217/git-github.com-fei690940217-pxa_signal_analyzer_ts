/*
 * @Author: feifei
 * @Date: 2024-12-18 15:44:42
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 14:19:04
 * @FilePath: \pxa_signal_analyzer\src\BroadcastChannel\index.ts
 * @Description:广播
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
//通用信道
export const normalChannel = new BroadcastChannel('my-channel');

//log专用信道
export const logChannel = new BroadcastChannel('logChannel');
//刷新项目列表专用信道
export const refreshProjectListChannel = new BroadcastChannel(
  'refreshProjectListChannel',
);
