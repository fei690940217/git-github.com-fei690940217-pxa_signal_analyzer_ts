/*
 * @FilePath: \pxa_signal_analyzer\src\renderer1\store\modules\projectList.ts
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-31 11:56:56
 * @Descripttion:
 */
import { createSlice } from '@reduxjs/toolkit';
import { electronStoreSet } from '@src/renderer1/utils/electronStore';
import {
  ProjectItemType,
  BandItemInfo,
  AddFormValueType,
  NewAddFormValueType,
} from '@src/customTypes/renderer';
import { cloneDeep } from 'lodash';
import localforage from 'localforage';
import { AddDirType } from '@src/customTypes';

type InitialStateType = {
  dirList: AddDirType[];
  projectList: ProjectItemType[];
  currentRow: ProjectItemType | null;
  selectBand: BandItemInfo[];
  addFormValue: NewAddFormValueType;
};
const initAddFormValue: NewAddFormValueType = {
  projectName: '',
  networkMode: 'SA',
  testItems: 'PAR',
  isGate: false,
  selectBand: [],
  LTE_BW: 0,
  LTE_ARFCN: 0,
  RBConfigSelected: [],
};
//初始化时获取项目列表
const initialState: InitialStateType = {
  dirList: [],
  projectList: [],
  //当前行数据
  currentRow: null,
  selectBand: [],
  addFormValue: cloneDeep(initAddFormValue),
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
    setAddFormValue: (state, action) => {
      let payload = action.payload;
      state.addFormValue = payload;
      localforage.setItem('addFormValue', payload);
    },
    setDirList: (state, action) => {
      let payload = action.payload;
      state.dirList = payload;
    },
  },
});
export const { setProjectList, changeCurrentRow, setAddFormValue, setDirList } =
  projectListSlice.actions;
