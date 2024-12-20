/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\modules\projectList.ts
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 14:09:27
 * @Descripttion:
 */
import { createSlice } from '@reduxjs/toolkit';
import { electronStoreSet } from '@src/renderer/utils/electronStore';
import { ProjectItemType } from '@src/customTypes/renderer';
type InitialStateType = {
  projectList: ProjectItemType[];
  currentRow: ProjectItemType | null;
};
//初始化时获取项目列表
const initialState: InitialStateType = {
  projectList: [],
  //当前行数据
  currentRow: null,
};
export const projectListSlice = createSlice({
  //命名空间
  name: 'projectList',
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
      electronStoreSet('currentRow', payload);
    },
  },
});
export const { setProjectList, changeCurrentRow } = projectListSlice.actions;

// export default projectListSlice.reducer;
