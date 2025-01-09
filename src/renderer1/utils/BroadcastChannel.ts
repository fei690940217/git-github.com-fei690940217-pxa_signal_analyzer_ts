/*
 * @Author: feifei
 * @Date: 2024-12-18 15:44:42
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 10:12:17
 * @FilePath: \pxa_signal_analyzer\src\renderer1\utils\BroadcastChannel.ts
 * @Description:广播
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
//通用信道
export const normalChannel = new BroadcastChannel('my-channel');

//log专用信道
export const logChannel = new BroadcastChannel('logChannel');
