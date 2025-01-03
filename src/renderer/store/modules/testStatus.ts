/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\modules\testStatus.ts
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 10:59:43
 * @Descripttion: 测试状态,判断是暂停,进行中等等
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  electronStoreSet,
  electronStoreGet,
} from '@src/renderer/utils/electronStore';
import { LogListType } from '@src/customTypes/renderer';
type InitialStateType = {
  isInProgress: boolean;
  isTimeout: boolean;
  logList: LogListType[];
  localLogList: LogListType[];
  currentTestRecordName: string;
};
export const testStatusSlice = createSlice({
  //命名空间
  name: 'testStatus',
  //初始化数据
  initialState: {
    //测试状态
    isInProgress: electronStoreGet('isInProgress') || false,
    //是否暂停中
    isTimeout: electronStoreGet('isTimeout') || false,
    logList: [],
    localLogList: [],
    currentTestRecordName: electronStoreGet('currentTestRecordName') || '',
  } as InitialStateType,
  //相当于vuex的mutions
  reducers: {
    setIsInProgress: (state, action: PayloadAction<boolean>) => {
      electronStoreSet('isInProgress', action.payload);
      state.isInProgress = action.payload;
    },
    setIsTimeout: (state, action: PayloadAction<boolean>) => {
      electronStoreSet('isTimeout', action.payload);
      state.isTimeout = action.payload;
    },
    setLogList: (state, action: PayloadAction<LogListType[]>) => {
      state.logList = action.payload;
    },
    setLocalLogList: (state, action: PayloadAction<LogListType[]>) => {
      state.localLogList = action.payload;
    },
    setCurrentTestRecordName: (state, action: PayloadAction<string>) => {
      state.currentTestRecordName = action.payload;
      console.log('setCurrentTestRecordName', action.payload);
      electronStoreSet('currentTestRecordName', action.payload);
    },
  },
});

export const {
  setLogList,
  setLocalLogList,
  setCurrentTestRecordName,
  setIsInProgress,
  setIsTimeout,
} = testStatusSlice.actions;

export default testStatusSlice.reducer;
