/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 15:09:11
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\planTableCard\statusBar\handleButton\index.jsx
 * @Description: 主测试模块
 */

import React, { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tag, Tooltip, message, notification } from "antd";
import {
  CaretRightOutlined,
  SyncOutlined,
  PauseOutlined,
} from "@ant-design/icons";
import { setIsInProgress, setIsTimeout } from "@/store/modules/testStatus";
import addLog from "@/store/asyncThunk/addLog";

import { useTranslation } from "react-i18next";
import modalConfirm from "@/utils/modalConfirm";
import { logError } from "@/utils/logLevel.js";
const { ipcRenderer } = window.myApi;
//操作按钮 开始 or 暂停 or 继续
export default ({ currentSelectedItem }) => {
  const { t, i18n } = useTranslation("testPage");
  const isInProgress = useSelector((state) => state.testStatus.isInProgress);
  const isTimeout = useSelector((state) => state.testStatus.isTimeout);
  const currentRow = useSelector((state) => state.projectList.currentRow);

  const currentTestRecordName = useSelector(
    (state) => state.testStatus.currentTestRecordName
  );
  const dispatch = useDispatch();
  //生成测试参数,传递给测试进程
  const startParams = () => {
    const obj = {
      parentProjectName: currentRow.projectName,
      subProjectName: currentTestRecordName,
      currentSelectedItem,
    };
    //通知测试进程开始测试,参数为argv  []数组意思是全测
    const argv = JSON.stringify(obj);
    return argv;
  };
  //开始测试
  const startFn = async () => {
    //传递argv 为空数组则是全测
    try {
      if (!currentTestRecordName) {
        return message.error("请选择子项目");
      }
      if (isInProgress) {
        return message.error("测试进行中,请勿重复点击");
      }
      if (!currentSelectedItem?.id) {
        return message.error("请选择要测试的条目");
      }
      await modalConfirm("确认开始测试?");
      //添加log
      const log = `success_-_${currentRow.projectName} <${currentTestRecordName}> 开始测试`;
      dispatch(addLog(log));
      const argv = startParams();
      ipcRenderer.send("startTest", argv);
      //切换测试状态
      await dispatch(setIsInProgress(true));
    } catch (error) {
      logError(error.toString());
      if (error) {
        if (error !== "取消") {
          notification.warning({
            message: String(error),
            placement: "topLeft",
          });
        }
      }
    }
  };
  //继续
  const continueFn = () => {
    dispatch(setIsTimeout(false));
  };
  //暂停
  const timeoutFn = async () => {
    await dispatch(setIsTimeout(true));
    //通知测试进程暂停测试
    ipcRenderer.send("timeoutTest");
  };
  //进行中
  if (isInProgress) {
    //暂停
    if (isTimeout) {
      return (
        <Tooltip title={t("pausedTooltip")} color="#009966">
          <Tag onClick={continueFn} icon={<PauseOutlined />} color="warning">
            {/* 暂停中 */}
            {t("paused")}
          </Tag>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title={t("underTestingTooltip")} color="#FF9900">
          <Tag onClick={timeoutFn} icon={<SyncOutlined spin />} color="#009966">
            {/* 测试中 */}
            {t("underTesting")}
          </Tag>
        </Tooltip>
      );
    }
  } else {
    return (
      <Tooltip title={t("notStartedTooltip")} color="#67C23A">
        <Tag onClick={startFn} icon={<CaretRightOutlined />} color="#67C23A">
          {/* 未开始 */}
          {t("testStart")}
        </Tag>
      </Tooltip>
    );
  }
};
