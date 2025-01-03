/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\modules\home.ts
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 11:01:29
 * @Descripttion: home reducer
 */
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
type InitialStateType = {
  isPermission: boolean;
  isLoading: boolean;
};
export const homeSlice = createSlice({
  //命名空间
  name: 'home',
  //初始化数据
  initialState: {
    //是否有权限,默认有权限,启动visa之后再做判断
    isPermission: true,
    isLoading: false,
  } as InitialStateType,

  //相当于vuex的mutions
  reducers: {
    setIsPermission: (state, action: PayloadAction<boolean>) => {
      const flag = action.payload;
      state.isPermission = flag;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      const flag = action.payload;
      state.isLoading = flag;
    },
  },
});

export const { setIsPermission, setIsLoading } = homeSlice.actions;

export default homeSlice.reducer;
