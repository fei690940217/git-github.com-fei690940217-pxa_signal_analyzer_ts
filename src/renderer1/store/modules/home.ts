/*
 * @FilePath: \fcc_5g_test_system\src\store\modules\home.js
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2023-08-22 13:17:08
 * @Descripttion: home reducer
 */
import { createSlice } from "@reduxjs/toolkit";
export const homeSlice = createSlice({
  //命名空间
  name: "home",
  //初始化数据
  initialState: {
    //是否有权限,默认有权限,启动visa之后再做判断
    isPermission: true,
    isLoading: false,
  },

  //相当于vuex的mutions
  reducers: {
    setIsPermission: (state, action) => {
      const flag = action.payload;
      state.isPermission = flag;
    },
    setIsLoading: (state, action) => {
      const flag = action.payload;
      state.isLoading = flag;
    },
  },
});

export const { setIsPermission, setIsLoading } = homeSlice.actions;

export default homeSlice.reducer;
