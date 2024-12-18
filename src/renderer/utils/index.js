/*
 * @File Path: \fcc_5g_test_system_only_spectrum\src\utils\index.js
 * @Author: xxx
 * @Date: 2023-03-14 15:46:45
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 15:17:00
 * @Descripttion:
 */
import Store from "@/store/index";
import { setIsLoading } from "@/store/modules/home";
import { debounce } from "lodash";

const { dispatch, getState } = Store;
const { ipcRenderer } = window.myApi;
//通知main进程,添加日志
//payload {level:'error | warn | info',msg:'日志内容'}
export const addLogRendererToMain = (payload) => {
  ipcRenderer.send("addLogRendererToMain", payload);
}
//等待函数
export const delayTime = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};
export const switchLoading = debounce((flag) => {
  const rootState = getState();
  const isLoading = rootState.home.isLoading;
  if (isLoading !== flag) {
    dispatch(setIsLoading(flag));
  }
}, 500);
//

