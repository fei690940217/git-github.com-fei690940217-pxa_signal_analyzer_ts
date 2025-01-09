/*
 * @Author: feifei
 * @Date: 2025-01-09 13:31:46
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 13:56:47
 * @FilePath: \pxa_signal_analyzer\src\renderer1\utils\broadcastLog.ts
 * @Description:向mainWindow广播log
 *
 * Copyright (c) 2025 by ${git_name_email}, All Rights Reserved.
 */
//向mainWindow广播log
// import { logChannel } from './BroadcastChannel';
import { logChannel } from '@src/BroadcastChannel';

export default (log: string) => {
  if (log) {
    logChannel.postMessage(log);
  }
};
