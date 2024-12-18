/*
 * @FilePath: \fcc_5g_test_system\src\store\modules\config.js
 * @Author: xxx
 * @Date: 2023-02-23 18:04:48
 * @LastEditors: feifei
 * @LastEditTime: 2023-12-01 17:55:23
 * @Descripttion: 基站与频谱配置数据
 */
import { createSlice } from "@reduxjs/toolkit";
const { electronStore } = window.myApi;


const initialState = {
  //频谱设置
  spectrumConfig: electronStore.get("spectrumConfig") || {},
};
export const configSlice = createSlice({
  //命名空间
  name: "config",
  //初始化数据
  initialState,
  //相当于vuex的mutions
  reducers: {
    setSpectrumConfig: (state, action) => {
      state.spectrumConfig = action.payload;
      electronStore.set("spectrumConfig", action.payload);
    },
  },
});

export const {
  setSpectrumConfig,
} = configSlice.actions;

export default configSlice.reducer;
