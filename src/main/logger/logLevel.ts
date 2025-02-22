/*
 * @Author: feifei
 * @Date: 2024-12-17 09:44:49
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 10:18:26
 * @FilePath: \pxa_signal_analyzer\src\main\logger\logLevel.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import logger from './index';

export const logInfo = (msg: string) => {
  console.log(msg);
  logger.info(msg);
};

export const logError = (msg: string) => {
  const newMsg = msg?.toString();
  console.log('logError', newMsg);
  console.error(newMsg);
  logger.error(newMsg);
};
