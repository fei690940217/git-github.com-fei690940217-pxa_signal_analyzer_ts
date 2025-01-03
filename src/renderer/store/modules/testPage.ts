/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\modules\testPage.ts
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 15:08:57
 * @Descripttion:
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { ProjectItemType, ResultItemType } from '@src/customTypes/renderer';
import { AddDirType } from '@src/customTypes';
import localforage from 'localforage';

type InitialStateType = {
  currentDir: AddDirType | null | undefined;
  currentSubProject: ProjectItemType | null | undefined;
  currentResultItem: ResultItemType | null | undefined;
};
//初始化时获取项目列表
const initialState: InitialStateType = {
  currentDir: null,
  currentSubProject: null,
  currentResultItem: null,
};
export const projectListSlice = createSlice({
  //命名空间
  name: 'testPage',
  //初始化数据
  initialState,
  //相当于vuex的mutions
  reducers: {
    setCurrentDir: (
      state,
      action: PayloadAction<AddDirType | null | undefined>,
    ) => {
      let payload = action.payload;
      state.currentDir = payload;
      localforage.setItem('currentDir', payload);
    },
    setCurrentSubProject: (
      state,
      action: PayloadAction<ProjectItemType | null | undefined>,
    ) => {
      const payload = action.payload;
      state.currentSubProject = payload;
      localforage.setItem('currentSubProject', payload);
    },

    setCurrentResultItem: (
      state,
      action: PayloadAction<ResultItemType | null | undefined>,
    ) => {
      let payload = action.payload;
      state.currentResultItem = payload;
      localforage.setItem('currentResultItem', payload);
    },
  },
});
export const { setCurrentDir, setCurrentSubProject, setCurrentResultItem } =
  projectListSlice.actions;

export default projectListSlice.reducer;
