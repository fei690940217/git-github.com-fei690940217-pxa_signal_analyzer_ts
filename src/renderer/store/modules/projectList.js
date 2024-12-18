/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\store\modules\projectList.js
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-11 17:56:12
 * @Descripttion:
 */
import { createSlice } from "@reduxjs/toolkit";
import { setCurrentTestRecordName } from "./testStatus";
const { fs, appConfigFilePath, electronStore } = window.myApi;

//初始化时获取项目列表
const initialState = {
  projectList: [],
  //当前行数据
  currentRow: electronStore.get("currentRow") || {},
};
export const projectListSlice = createSlice({
  //命名空间
  name: "projectList",
  //初始化数据
  initialState,
  //相当于vuex的mutions
  reducers: {
    setProjectList: (state, action) => {
      let tempProjectList = action.payload;
      state.projectList = tempProjectList;
    },
    changeCurrentRow: (state, action) => {
      let payload = action.payload;
      state.currentRow = payload;
      electronStore.set("currentRow", payload);
    },
  },
});
export const { setProjectList, changeCurrentRow } = projectListSlice.actions;


export const setCurrentRow = (payload) => (dispatch, getState) => {
  // 不需要进行实际的异步操作
  dispatch(projectListSlice.actions.changeCurrentRow(payload));
  // 触发第二个 slice 的 action
  dispatch(setCurrentTestRecordName(""));
};
export default projectListSlice.reducer;
