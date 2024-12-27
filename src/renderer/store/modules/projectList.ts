/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\modules\projectList.ts
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:13:44
 * @Descripttion:
 */
import { createSlice } from '@reduxjs/toolkit';
import { electronStoreSet } from '@src/renderer/utils/electronStore';
import { ProjectItemType, BandItemInfo } from '@src/customTypes/renderer';
type InitialStateType = {
  projectList: ProjectItemType[];
  currentRow: ProjectItemType | null;
  selectBand: BandItemInfo[];
};
//初始化时获取项目列表
const initialState: InitialStateType = {
  projectList: [],
  //当前行数据
  currentRow: null,
  selectBand: [],
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
    setSelectBand: (state, action) => {
      let payload = action.payload;
      state.selectBand = payload;
    },
  },
});
export const { setProjectList, changeCurrentRow, setSelectBand } =
  projectListSlice.actions;

// export default projectListSlice.reducer;
