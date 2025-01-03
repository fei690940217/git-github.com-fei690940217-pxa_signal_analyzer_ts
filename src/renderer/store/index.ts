/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\index.ts
 * @Author: xxx
 * @Date: 2022-06-15 16:14:12
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 09:33:48
 * @Descripttion:
 */
import { configureStore } from '@reduxjs/toolkit';
import home from './modules/home';
import { projectListSlice } from './modules/projectList';
import testStatus from './modules/testStatus';
import testPage from './modules/testPage';
const store = configureStore({
  reducer: {
    home,
    projectList: projectListSlice.reducer,
    testStatus,
    testPage,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
// store.dispatch(initARFCNConfig());
// store.dispatch(initBandList());

export default store;
