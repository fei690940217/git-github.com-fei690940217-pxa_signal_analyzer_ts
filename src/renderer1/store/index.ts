/*
 * @FilePath: \pxa_signal_analyzer\src\renderer1\store\index.ts
 * @Author: xxx
 * @Date: 2022-06-15 16:14:12
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 16:32:07
 * @Descripttion:
 */
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { NewAddFormValueType } from '@src/customTypes/renderer';
import { cloneDeep } from 'lodash';
import localforage from 'localforage';

type InitialStateType = {
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
  addFormValue: cloneDeep(initAddFormValue),
};
export const appSlice = createSlice({
  //命名空间
  name: 'projectList',
  //初始化数据
  initialState,
  //相当于vuex的mutions
  reducers: {
    setAddFormValue: (state, action) => {
      let payload = action.payload;
      state.addFormValue = payload;
      localforage.setItem('addFormValue', payload);
    },
  },
});
export const { setAddFormValue } = appSlice.actions;

const store = configureStore({
  reducer: appSlice.reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// store.dispatch(initARFCNConfig());
// store.dispatch(initBandList());

export default store;
