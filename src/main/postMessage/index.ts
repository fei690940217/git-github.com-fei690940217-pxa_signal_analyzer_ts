/*
 * @Author: feifei
 * @Date: 2023-09-27 09:20:05
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 14:32:27
 * @FilePath: \pxa_signal_analyzer\src\main\postMessage\index.ts
 * @Description:多渲染进程之间的通信方案  基于 MessageChannelMain
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */

import { MessageChannelMain } from 'electron';
import type { MessagePortMain } from 'electron';
const { port1, port2 } = new MessageChannelMain();
console.log('port1', port1);
console.log('port2', port2);

export { port1, port2 };
