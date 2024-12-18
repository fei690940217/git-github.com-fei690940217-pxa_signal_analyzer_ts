/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\store\modules\testStatus.js
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 11:52:15
 * @Descripttion: 测试状态,判断是暂停,进行中等等
 */
import { createSlice } from "@reduxjs/toolkit";
const { electronStore } = window.myApi;
export const testStatusSlice = createSlice({
  //命名空间
  name: "testStatus",
  //初始化数据
  initialState: {
    //测试状态
    isInProgress: electronStore.get("isInProgress") || false,
    //是否暂停中
    isTimeout: electronStore.get("isTimeout") || false,
    logList: [],
    localLogList: [],
    currentTestRecordName: electronStore.get("currentTestRecordName") || "",
  },
  //相当于vuex的mutions
  reducers: {
    setIsInProgress: (state, action) => {
      electronStore.set("isInProgress", action.payload);
      state.isInProgress = action.payload;
    },
    setIsTimeout: (state, action) => {
      electronStore.set("isTimeout", action.payload);
      state.isTimeout = action.payload;
    },
    setLogList: (state, action) => {
      state.logList = action.payload
    },
    setLocalLogList: (state, action) => {
      state.localLogList = action.payload;
    },
    setCurrentTestRecordName: (state, action) => {
      state.currentTestRecordName = action.payload;
      electronStore.set("currentTestRecordName", action.payload);
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
