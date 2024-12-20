/*
 * @Author: feifei
 * @Date: 2024-12-17 16:21:14
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 13:49:30
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\asyncThunk\addLog.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { setLogList, setLocalLogList } from '../modules/testStatus';
import { nanoid } from 'nanoid';
import Moment from 'moment';
import { throttle } from 'lodash';
import { addLogRendererToMain } from '@/utils';
import { RootState, AppDispatch } from '@src/renderer/store';
const maxLogs = 300;
const throttleSetLocalLogList = throttle(
  (dispatch, logList) => {
    const list = logList.slice(0, 50);
    dispatch(setLocalLogList(list));
  },
  300,
  { leading: true, trailing: true },
);

export default (payload: string) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const rootState = getState();
    const tempLogList = rootState.testStatus.logList;
    // 拷贝现有日志数组
    const logList = [...tempLogList];
    const payloadArr = payload.split('_-_');
    const type = payloadArr.length === 1 ? 'info' : payloadArr[0];
    let level = 'info';
    switch (type) {
      case 'success':
        level = 'info';
        break;
      case 'warning':
        level = 'warn';
        break;
    }
    const message = payloadArr.length === 1 ? payloadArr[0] : payloadArr[1];
    addLogRendererToMain({ level, msg: message });
    const newPayload = {
      id: nanoid(8),
      createDate: Moment().format('YYYY-MM-DD HH:mm:ss'),
      type,
      message,
    };
    logList.unshift(newPayload);
    if (logList?.length > maxLogs) {
      logList.pop();
    }
    // 更新日志列表
    dispatch(setLogList(logList));
    throttleSetLocalLogList(dispatch, logList);
  };
};
