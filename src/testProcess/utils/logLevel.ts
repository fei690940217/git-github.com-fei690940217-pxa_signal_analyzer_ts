/*
 * @Author: feifei
 * @Date: 2024-12-17 14:54:12
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 14:18:58
 * @FilePath: \pxa_signal_analyzer\src\testProcess\utils\logLevel.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import logger from '@src/testProcess/logger';

export const logInfo = (msg: string) => {
  console.log(msg);
  logger.info(msg);
};

export const logError = (msg: string) => {
  console.error(msg);
  logger.error(msg);
};
