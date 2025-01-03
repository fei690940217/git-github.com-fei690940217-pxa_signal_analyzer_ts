/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 14:21:45
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\statusBar\handleButton.tsx
 * @Description: 主测试模块
 */

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tag, Tooltip, message, notification } from 'antd';
import {
  CaretRightOutlined,
  SyncOutlined,
  PauseOutlined,
} from '@ant-design/icons';
import { setIsInProgress, setIsTimeout } from '@/store/modules/testStatus';
import addLog from '@/store/asyncThunk/addLog';

import { useTranslation } from 'react-i18next';
import modalConfirm from '@/utils/modalConfirm';
import { logError } from '@/utils/logLevel';
import { ResultItemType } from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';

const { ipcRenderer } = window.myApi;
//操作按钮 开始 or 暂停 or 继续
export default () => {
  const { t, i18n } = useTranslation('testPage');
  const isInProgress = useAppSelector((state) => state.testStatus.isInProgress);
  const isTimeout = useAppSelector((state) => state.testStatus.isTimeout);
  const currentDir = useAppSelector((state) => state.testPage.currentDir);
  const currentSubProject = useAppSelector(
    (state) => state.testPage.currentSubProject,
  );
  const currentResultItem = useAppSelector(
    (state) => state.testPage.currentResultItem,
  );
  const dispatch = useAppDispatch();
  //生成测试参数,传递给测试进程
  const startParams = () => {
    const obj = {
      parentProjectName: currentDir?.dirName,
      subProjectName: currentSubProject?.projectName,
      currentSelectedItem: currentResultItem,
    };
    //通知测试进程开始测试,参数为argv  []数组意思是全测
    const argv = JSON.stringify(obj);
    return argv;
  };
  //开始测试
  const startFn = async () => {
    //传递argv 为空数组则是全测
    try {
      if (!currentDir?.dirName) {
        return message.error('请选择目录');
      }
      if (!currentSubProject?.projectName) {
        return message.error('请选择测试项目');
      }
      if (isInProgress) {
        return message.error('测试进行中,请勿重复点击');
      }
      if (!currentResultItem?.id) {
        return message.error('请选择要测试的条目');
      }
      await modalConfirm('确认开始测试?');
      //添加log
      const log = `success_-_${currentDir?.dirName}/${currentSubProject?.projectName} 开始测试`;
      dispatch(addLog(log));
      const argv = startParams();
      ipcRenderer.send('startTest', argv);
      //切换测试状态
      await dispatch(setIsInProgress(true));
    } catch (error) {
      logError(error?.toString());
      if (error) {
        if (error !== '取消') {
          notification.warning({
            message: String(error),
            placement: 'topLeft',
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
    ipcRenderer.send('timeoutTest');
  };
  //进行中
  if (isInProgress) {
    //暂停
    if (isTimeout) {
      return (
        <Tooltip title="继续测试" color="#009966">
          <Tag onClick={continueFn} icon={<PauseOutlined />} color="warning">
            已暂停
          </Tag>
        </Tooltip>
      );
    } else {
      return (
        <Tooltip title="暂停测试" color="#FF9900">
          <Tag onClick={timeoutFn} icon={<SyncOutlined spin />} color="#009966">
            测试中
          </Tag>
        </Tooltip>
      );
    }
  } else {
    return (
      <Tag onClick={startFn} icon={<CaretRightOutlined />} color="#67C23A">
        开始测试
      </Tag>
    );
  }
};
