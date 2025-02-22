/*
 * @Author: feifei
 * @Date: 2024-12-19 11:14:47
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 14:12:22
 * @FilePath: \pxa_signal_analyzer\src\renderer\store\asyncThunk\setCurrentRow.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { changeCurrentRow } from '../modules/projectList';
import { setCurrentTestRecordName } from '../modules/testStatus';
import { RootState, AppDispatch } from '@src/renderer/store';
import { ProjectItemType } from '@src/customTypes/renderer';

//重点是如何处理CurrentTestRecordName
export default (payload: ProjectItemType | null) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    //获取当前行nowRow
    const rootState = getState();
    const tempCurrentRow = rootState.projectList.currentRow;
    const tempCurrentTestRecordName =
      rootState.testStatus.currentTestRecordName;
    // 不需要进行实际的异步操作
    dispatch(changeCurrentRow(payload));
    // 触发第二个 slice 的 action
    //如果项目被切换,且当前测试记录不为空,则清空当前测试记录
    if (payload?.id) {
      if (payload?.id !== tempCurrentRow?.id && tempCurrentTestRecordName) {
        dispatch(setCurrentTestRecordName(''));
      }
    } else {
      dispatch(setCurrentTestRecordName(''));
    }
  };
