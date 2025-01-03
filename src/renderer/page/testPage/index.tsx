/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 15:24:11
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\index.tsx
 * @Description: 测试与列表主页
 */
import { useEffect, useRef, useState } from 'react';
import './index.scss';
import StatusBar from './statusBar';
import PlanTableCard from './planTableCard';
import LogCard from './logCard';

import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import {
  ProjectItemType,
  ResultItemType,
  StatusType,
} from '@src/customTypes/renderer';
import {
  getCurrentResult,
  handleProcessExitFn,
  getSubProjectList,
  getDirList,
} from './util';
import {
  setCurrentDir,
  setCurrentSubProject,
  setCurrentResultItem,
} from '@src/renderer/store/modules/testPage';
import { AddDirType } from '@src/customTypes';
import localforage from 'localforage';
const { ipcRendererOn, ipcRendererOff, ipcRenderer } = window.myApi;
export default () => {
  const dispatch = useAppDispatch();
  const currentDir = useAppSelector((state) => state.testPage.currentDir);
  const currentSubProject = useAppSelector(
    (state) => state.testPage.currentSubProject,
  );
  const currentResultItem = useAppSelector(
    (state) => state.testPage.currentResultItem,
  );
  const [currentResult, setCurrentResult] = useState<ResultItemType[]>([]);

  //两个表的数据源
  const [dirList, setDirList] = useState<AddDirType[]>([]);
  const [subProjectList, setSubProjectList] = useState<ProjectItemType[]>([]);

  //用于保存当前行id
  const currentResultItemRef = useRef(currentResultItem?.id);
  useEffect(() => {
    currentResultItemRef.current = currentResultItem?.id;
  }, [currentResultItem?.id]);
  //监测测试停止
  useEffect(() => {
    const handleProcessExit = async (_e: any, status: StatusType) => {
      if (currentResultItemRef.current) {
        handleProcessExitFn(
          status,
          currentResultItemRef.current,
          setCurrentResult,
        );
      }
    };
    ipcRendererOn('processExit', handleProcessExit);
    // 注销监听函数
    return () => {
      ipcRendererOff('processExit', handleProcessExit); // 清理监听器
    };
  }, []);
  const refreshCurrentResult = async () => {
    try {
      if (currentDir?.id && currentSubProject?.id) {
        const list = await getCurrentResult(
          currentDir.dirName,
          currentSubProject.projectName,
        );
        setCurrentResult(list);
      } else {
        setCurrentResult([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //子项目变化
  useEffect(() => {
    refreshCurrentResult();
  }, [currentSubProject?.id]);
  //init处理比较复杂
  const init_fn = async () => {
    try {
      //获取项目列表
      const dirList: AddDirType[] = await getDirList();
      setDirList(dirList);
      const localCurrentDir =
        await localforage.getItem<AddDirType>('currentDir');
      //如果Dir有值且存在于dirList中，则设置为当前目录
      const findDirIndex = dirList.findIndex(
        (item) => item.id === localCurrentDir?.id,
      );
      if (findDirIndex < 0 || !localCurrentDir) return;
      dispatch(setCurrentDir(localCurrentDir));

      //------------------------------------------------子项目列表

      const subList = await getSubProjectList(localCurrentDir.dirName);
      setSubProjectList(subList);
      //处理 localCurrentSubProject
      const localCurrentSubProject =
        await localforage.getItem<ProjectItemType>('currentSubProject');
      console.log('localCurrentSubProject', localCurrentSubProject);
      const findSubIndex = subList.findIndex(
        (item) => item.id === localCurrentSubProject?.id,
      );
      console.log('find localCurrentSubProject', findSubIndex);
      if (findSubIndex < 0 || !localCurrentSubProject) return;
      dispatch(setCurrentSubProject(localCurrentSubProject));

      //初始化当前结果
      const resultList = await getCurrentResult(
        localCurrentDir?.dirName,
        localCurrentSubProject?.projectName,
      );
      console.log('resultList', resultList);
      setCurrentResult(resultList);
      //接着处理
      const localCurrentResultItem =
        await localforage.getItem<ResultItemType>('currentResultItem');
      console.log(' localCurrentResultItem', localCurrentResultItem);

      const findResultIndex = resultList.findIndex(
        (item) => item.id === localCurrentResultItem?.id,
      );
      console.log(' findResultIndex', findResultIndex);

      if (!localCurrentResultItem || findResultIndex < 0) return;
      dispatch(setCurrentResultItem(localCurrentResultItem));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    init_fn();
  }, []);
  const flag = currentDir?.id && currentSubProject?.id;
  return (
    <div className="test-plan-wrapper">
      <div className="test-plan-header">
        <StatusBar
          dirList={dirList}
          subProjectList={subProjectList}
          setSubProjectList={setSubProjectList}
        />
      </div>
      <div className="test-plan-body">
        {flag ? (
          <PlanTableCard
            currentResult={currentResult}
            refreshCurrentResult={refreshCurrentResult}
          />
        ) : (
          <Result
            style={{
              height: '100%',
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
            }}
            icon={<SmileOutlined style={{ color: '#DCDFE6' }} />}
            title={<div style={{ color: '#DCDFE6' }}>请选择要测试的项目</div>}
          />
        )}
      </div>
      <div className="test-plan-footer">
        <LogCard />
      </div>
    </div>
  );
};
