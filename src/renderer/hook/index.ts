/*
 * @Author: feifei
 * @Date: 2023-11-06 14:08:54
 * @LastEditors: feifei
 * @LastEditTime: 2023-11-06 14:13:44
 * @FilePath: \fcc_power_test\src\renderer\hook\index.ts
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// 在整个应用中使用，而不是简单的使用 `useDispatch` 和 `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
