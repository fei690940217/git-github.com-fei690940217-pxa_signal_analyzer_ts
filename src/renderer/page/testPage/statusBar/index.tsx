/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 15:30:45
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\statusBar\index.tsx
 * @Description: 主测试模块
 */

import { useEffect, useState } from 'react';
import './index.scss';
import { App, Select, Tooltip } from 'antd';
import { setIsInProgress } from '@src/renderer/store/modules/testStatus';
import {
  setCurrentDir,
  setCurrentSubProject,
  setCurrentResultItem,
} from '@src/renderer/store/modules/testPage';
import { useTranslation } from 'react-i18next';
import HandleButton from './handleButton';
import modalConfirm from '@src/renderer/utils/modalConfirm';
import { logError } from '@src/renderer/utils/logLevel';
import { ResultItemType, ProjectItemType } from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import { AddDirType } from '@src/customTypes';
import { getSubProjectList } from '../util';

const { ipcRenderer } = window.myApi;
type Props = {
  dirList: AddDirType[];
  subProjectList: ProjectItemType[];
  setSubProjectList: (params: ProjectItemType[]) => void;
};
export default ({ dirList, subProjectList, setSubProjectList }: Props) => {
  const { t, i18n } = useTranslation('testPage');
  const dispatch = useAppDispatch();
  //当前选中行的数据
  //当前是否在测试中
  const isInProgress = useAppSelector((state) => state.testStatus.isInProgress);
  const currentDir = useAppSelector((state) => state.testPage.currentDir);
  const currentSubProject = useAppSelector(
    (state) => state.testPage.currentSubProject,
  );

  //结束测试
  const abortTest = async () => {
    try {
      if (isInProgress) {
        await modalConfirm('确认结束测试?', '');
        dispatch(setIsInProgress(false));
        //通知main进程kill测试进程
        ipcRenderer.send('abortTest');
      }
    } catch (error) {
      logError(error?.toString() || '');
    }
  };
  //目录变化
  const dirChange = async (value: string) => {
    if (value) {
      const tempDir = dirList.find((item) => item.id === value);
      dispatch(setCurrentDir(tempDir));
      if (!tempDir) return;
      //重新获取子项目列表
      const subList = await getSubProjectList(tempDir.dirName);
      setSubProjectList(subList);
    } else {
      dispatch(setCurrentDir(null));
    }
    //重置子项目选择
    dispatch(setCurrentSubProject(null));
    //重置当前结果行
    dispatch(setCurrentResultItem(null));
  };
  //子项目变化
  const subProjectChange = (value: string) => {
    if (value) {
      const tempProject = subProjectList.find((item) => item.id === value);
      dispatch(setCurrentSubProject(tempProject));
    } else {
      dispatch(setCurrentSubProject(null));
    }
    //重置当前结果行
    dispatch(setCurrentResultItem(null));
  };
  return (
    <div className="status-bar-wrapper">
      <div className="status-bar-left">
        <span style={{ marginRight: 10, fontWeight: 600, fontSize: 16 }}>
          选择项目:
        </span>
        <Select
          placeholder="选择目录"
          disabled={isInProgress}
          size="small"
          value={currentDir?.id}
          style={{
            width: 200,
          }}
          onChange={dirChange}
          options={dirList}
          fieldNames={{ label: 'dirName', value: 'id' }}
        />
        <span style={{ margin: '0 5px' }}>/</span>
        <Select
          placeholder="选择项目"
          disabled={isInProgress}
          size="small"
          value={currentSubProject?.id}
          style={{
            width: 200,
          }}
          onChange={subProjectChange}
          options={subProjectList}
          fieldNames={{ label: 'projectName', value: 'id' }}
        />
      </div>
      <div className="status-bar-right">
        <div className="start-button-wrapper status-bar-right-item">
          <HandleButton />
        </div>
        <div className="abort-button-wrapper status-bar-right-item">
          <Tooltip title="结束" color="#990033">
            <i onClick={abortTest} className="abort-test-button" />
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
