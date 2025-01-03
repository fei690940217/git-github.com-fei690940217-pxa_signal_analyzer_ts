/*
 * @Author: feifei
 * @Date: 2024-12-04 14:07:27
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 15:23:35
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\util.ts
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import type { Key } from 'react';
import { Modal } from 'antd';
import Store from '@src/renderer/store';
import type { RootState, AppDispatch } from '@src/renderer/store';
import { logError } from '@src/renderer/utils/logLevel';
import {
  setIsInProgress,
  setIsTimeout,
} from '@src/renderer/store/modules/testStatus';
import {
  setCurrentDir,
  setCurrentSubProject,
  setCurrentResultItem,
} from '@src/renderer/store/modules/testPage';
import { verdictHandle } from '@src/common';
import {
  ResultItemType,
  StatusType,
  ProjectItemType,
} from '@src/customTypes/renderer';
import localforage from 'localforage';
import { AddDirType } from '@src/customTypes';
const { getState, dispatch } = Store;
const { ipcRenderer } = window.myApi;

//获取当前项目的测试列表
export const getCurrentResult = async (
  parentProjectName: string,
  subProjectName: string,
): Promise<ResultItemType[]> => {
  try {
    let result = [];
    if (parentProjectName && subProjectName) {
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
    logError(error?.toString() || '获取当前项目的测试列表失败');
    return Promise.reject(error);
  }
};
//验证结果是否通过
const validateResult = (result: ResultItemType[], id: Key) => {
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
      logError(error?.toString() || '验证结果是否通过失败');
      resolve(false);
    }
  });
};
type OpenModalType = 'pass' | 'fail' | 'error' | 'abort';
const openModal = (title: string, type: OpenModalType) => {
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
  status: StatusType,
  id: number,
  setCurrentResult: (list: ResultItemType[]) => void,
) => {
  const rootState: RootState = getState();
  const currentDir = rootState.testPage.currentDir;
  const currentSubProject = rootState.testPage.currentSubProject;
  const isInProgress = rootState.testStatus.isInProgress;
  const isTimeout = rootState.testStatus.isTimeout;
  //如果当前是暂停状态则取消暂停
  if (isTimeout) {
    dispatch(setIsTimeout(false));
  }
  //测试中改为false
  if (isInProgress) {
    dispatch(setIsInProgress(false));
  }
  if (!currentSubProject || !currentDir) {
    return;
  }
  const { dirName } = currentDir;
  const { projectName } = currentSubProject;
  //更新测试列表
  const list = await getCurrentResult(dirName, projectName);
  setCurrentResult(list);
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

//初始化数据
export const initLocalStorage = async () => {
  const currentDir = await localforage.getItem<AddDirType>('currentDir');
  const currentSubProject =
    await localforage.getItem<ProjectItemType>('currentSubProject');
  const currentResultItem =
    await localforage.getItem<ResultItemType>('currentResultItem');
  if (!currentDir) return;
  dispatch(setCurrentDir(currentDir));
  if (!currentSubProject) return;
  dispatch(setCurrentSubProject(currentSubProject));
  if (!currentResultItem) return;
  dispatch(setCurrentResultItem(currentResultItem));
};

//获取测试列表
export const getSubProjectList = async (dirName: string) => {
  try {
    if (!dirName) {
      return [];
    }
    const list: ProjectItemType[] = await ipcRenderer.invoke(
      'getSubProjectList',
      dirName,
    );
    console.log('getSubProjectList', list);
    return list;
  } catch (error) {
    logError(error?.toString() || '');
    return [];
  }
};

export const getDirList = async () => {
  try {
    //获取项目列表
    const dirList: AddDirType[] = await ipcRenderer.invoke('getJsonFile', {
      type: 'projectList',
    });
    return dirList;
  } catch (error) {
    logError(error?.toString() || 'getDirList 失败');
    return [];
  }
};
