/*
 * @Author: feifei
 * @Date: 2024-12-04 14:07:27
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-09 11:16:10
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\planTableCard\util.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { Modal } from 'antd';
import Store from '@/store/index';
import { logError } from '@/utils/logLevel.js';
import { setIsInProgress, setIsTimeout } from '@/store/modules/testStatus';
import { verdictHandle } from '@src/common/index.ts';

const { getState, dispatch } = Store;

const { ipcRenderer } = window.myApi;

//获取当前项目的测试列表
export const getCurrentResult = async (parentProjectName, subProjectName) => {
  try {
    let result = [];
    if (parentProjectName) {
      const list = await ipcRenderer.invoke('getJsonFile', {
        type: 'currentResult',
        params: {
          projectName: parentProjectName,
          subProjectName: subProjectName,
        },
      });
      result = list;
    }
    return Promise.resolve(result);
  } catch (error) {
    logError(error.toString());
    return Promise.reject(error);
  }
};
//验证结果是否通过
const validateResult = (result, id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const findItem = result.find((item) => {
        return item.id === id;
      });
      if (findItem) {
        const flag = verdictHandle(findItem);
        if (flag) {
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    } catch (error) {
      logError(error.toString());
      resolve(false);
    }
  });
};

const openModal = (title, type) => {
  Modal.info({
    title,
    icon: null,
    footer: null,
    centered: true,
    maskClosable: true,
    wrapClassName: `pass-fail-modal-wrapper`,
    className: `${type}-modal-container`,
  });
};
//监听测试进程退出
export const handleProcessExitFn = async (
  status,
  selectedListItem,
  setCurrentResult,
) => {
  const rootState = getState();
  const currentRow = rootState.projectList.currentRow;
  const isInProgress = rootState.testStatus.isInProgress;
  const isTimeout = rootState.testStatus.isTimeout;
  const currentTestRecordName = rootState.testStatus.currentTestRecordName;
  const { projectName } = currentRow;
  const id = selectedListItem[0];
  //更新测试列表
  const list = await getCurrentResult(projectName, currentTestRecordName);
  setCurrentResult(list);
  //如果当前是暂停状态则取消暂停
  if (isTimeout) {
    dispatch(setIsTimeout(false));
  }
  //测试中改为false
  if (isInProgress) {
    dispatch(setIsInProgress(false));
  }
  //成功状态下清除当前测试行,error状态下不清除当前行以便用户观察
  if (status === 'success') {
    const flag = await validateResult(list, id);
    const title = flag ? 'P A S S' : 'F A I L';
    const type = flag === true ? 'pass' : 'fail';
    openModal(title, type);
  } else if (status === 'error') {
    openModal('E R R O R', 'error');
  } else if (status === 'abort') {
    openModal('A B O R T', 'abort');
  }
};
