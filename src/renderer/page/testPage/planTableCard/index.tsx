/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 17:04:26
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\planTableCard\index.tsx
 * @Description: 主测试模块
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import './index.scss';
import { notification, Modal } from 'antd';
import StatusBar from './statusBar';
import ResultTable from './resultTable';
import { getCurrentResult, handleProcessExitFn } from './util';
import { useAppSelector } from '@src/renderer/hook';
import { ResultItemType, StatusType } from '@src/customTypes/renderer';

const { ipcRendererOn, ipcRendererOff } = window.myApi;

export default () => {
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  //父当前行
  const currentRow = useAppSelector((state) => state.projectList.currentRow);
  //子当前行
  const currentTestRecordName = useAppSelector(
    (state) => state.testStatus.currentTestRecordName,
  );
  const [selectedListItem, setSelectedListItem] = useState([]);
  const [currentResult, setCurrentResult] = useState<ResultItemType[]>([]);
  const selectedListItemRef = useRef(selectedListItem);
  useEffect(() => {
    // 更新最新的 selectedListItem
    selectedListItemRef.current = selectedListItem;
  }, [selectedListItem]);
  //currentSelectedItem
  const currentSelectedItem: ResultItemType | null = useMemo(() => {
    const id = selectedListItem?.length > 0 ? selectedListItem[0] : null;
    const flag = currentResult?.length > 0;
    if (id && flag) {
      const findItem = currentResult.find((item) => item.id === id);
      if (findItem) {
        return findItem;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }, [selectedListItem, currentResult]);
  const refreshCurrentResult = async () => {
    try {
      if (currentRow?.id) {
        const list = await getCurrentResult(
          currentRow.projectName,
          currentTestRecordName,
        );
        setCurrentResult(list);
      }
    } catch (error) {}
  };
  useEffect(() => {
    refreshCurrentResult();
  }, [currentRow, currentTestRecordName]);
  //监测测试停止
  useEffect(() => {
    const handleProcessExit = async (_e: any, status: StatusType) => {
      handleProcessExitFn(
        status,
        selectedListItemRef.current,
        setCurrentResult,
      );
    };
    ipcRendererOn('processExit', handleProcessExit);
    // 注销监听函数
    return () => {
      ipcRendererOff('processExit', handleProcessExit); // 清理监听器
    };
  }, []);
  return (
    <div className="test-plan-card">
      {notificationContextHolder}
      {modalContextHolder}
      {/* 状态栏 */}
      <StatusBar currentSelectedItem={currentSelectedItem} />
      <div className="plan-table-content">
        <ResultTable
          refreshCurrentResult={refreshCurrentResult}
          currentResult={currentResult}
          selectedListItem={selectedListItem}
          setSelectedListItem={setSelectedListItem}
        />
      </div>
    </div>
  );
};
