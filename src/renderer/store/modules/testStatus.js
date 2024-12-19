/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\modules\testStatus.js
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 11:46:57
 * @Descripttion: 测试状态,判断是暂停,进行中等等
 */
import { createSlice } from '@reduxjs/toolkit';
import {
  electronStoreSet,
  electronStoreGet,
} from '@src/renderer/utils/electronStore';

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
  },
  //相当于vuex的mutions
  reducers: {
    setIsInProgress: (state, action) => {
      electronStoreSet('isInProgress', action.payload);
      state.isInProgress = action.payload;
    },
    setIsTimeout: (state, action) => {
      electronStoreSet('isTimeout', action.payload);
      state.isTimeout = action.payload;
    },
    setLogList: (state, action) => {
      state.logList = action.payload;
    },
    setLocalLogList: (state, action) => {
      state.localLogList = action.payload;
    },
    setCurrentTestRecordName: (state, action) => {
      state.currentTestRecordName = action.payload;
      electronStoreSet('currentTestRecordName', action.payload);
    },
  },
});

export const {
  setLogList,
  setLocalLogList,
  setProgress,
  setTimeout,
  setCurrentTestRecordName,
  setIsInProgress,
  setIsTimeout,
} = testStatusSlice.actions;

export default testStatusSlice.reducer;
