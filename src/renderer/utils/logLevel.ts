/*
 * @Author: feifei
 * @Date: 2024-12-17 16:21:14
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 14:29:01
 * @FilePath: \pxa_signal_analyzer\src\renderer\utils\logLevel.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import loglevel from 'loglevel';
import { addLogRendererToMain } from './index';
type LogLevelType = 'trace' | 'debug' | 'info' | 'warn' | 'error';
const REACT_APP_LOG_LEVEL =
  (process.env.REACT_APP_LOG_LEVEL as LogLevelType) || 'info';
console.log(`REACT_APP_LOG_LEVEL: ${REACT_APP_LOG_LEVEL}`);
loglevel.setLevel(REACT_APP_LOG_LEVEL);

export const logInfo = (msg: string) => {
  loglevel.info(msg);
  addLogRendererToMain({ level: 'info', msg });
};

export const logError = (msg: string) => {
  loglevel.error(msg);
  addLogRendererToMain({ level: 'error', msg });
};
