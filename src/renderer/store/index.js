/*
 * @FilePath: \fcc_5g_test_system\src\store\index.js
 * @Author: xxx
 * @Date: 2022-06-15 16:14:12
 * @LastEditors: xxx
 * @LastEditTime: 2023-05-12 14:17:01
 * @Descripttion: 
 */
import { configureStore } from '@reduxjs/toolkit'
import home from './modules/home'
import config from './modules/config'
import projectList from './modules/projectList'
import testStatus from './modules/testStatus'
export default configureStore({
  reducer: {
    home,
    config,
    projectList,
    testStatus
  }
})
