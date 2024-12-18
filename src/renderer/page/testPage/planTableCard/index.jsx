/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-06 17:35:12
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\planTableCard\index.jsx
 * @Description: 主测试模块
 */

import React, { useEffect, useMemo, useRef, useState, lazy } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { Image, notification, Modal } from "antd";
import StatusBar from "./statusBar";
import ResultTable from "./resultTable";
import { getCurrentResult, handleProcessExitFn } from "./util";
const { ipcRendererOn, ipcRendererOff } = window.myApi;

export default () => {
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  //父当前行
  const currentRow = useSelector((state) => state.projectList.currentRow);
  //子当前行
  const currentTestRecordName = useSelector(
    (state) => state.testStatus.currentTestRecordName
  );
  const [selectedListItem, setSelectedListItem] = useState([]);
  const [currentResult, setCurrentResult] = useState([]);
  const selectedListItemRef = useRef(selectedListItem);
  useEffect(() => {
    // 更新最新的 selectedListItem
    selectedListItemRef.current = selectedListItem;
  }, [selectedListItem]);
  //currentSelectedItem
  const currentSelectedItem = useMemo(() => {
    const id = selectedListItem?.length > 0 ? selectedListItem[0] : null;
    const flag = currentResult?.length > 0;
    if (id && flag) {
      return currentResult.find((item) => item.id === id);
    } else {
      return null;
    }
  }, [selectedListItem, currentResult]);
  const refreshCurrentResult = async () => {
    try {
      const list = await getCurrentResult(
        currentRow.projectName,
        currentTestRecordName
      );
      setCurrentResult(list);
    } catch (error) {}
  };
  useEffect(() => {
    refreshCurrentResult();
  }, [currentRow, currentTestRecordName]);
  //监测测试停止
  useEffect(() => {
    const handleProcessExit = async (e, status) => {
      handleProcessExitFn(
        status,
        selectedListItemRef.current,
        setCurrentResult
      );
    };
    ipcRendererOn("processExit", handleProcessExit);
    // 注销监听函数
    return () => {
      ipcRendererOff("processExit", handleProcessExit); // 清理监听器
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
