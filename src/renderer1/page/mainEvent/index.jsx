/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 11:28:23
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-31 13:07:40
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\mainEvent\index.jsx
 * @Description: app辅助页面,处理main所有进程事件监听,无渲染逻辑
 */
import './index.scss';
import { Button, Modal, message, Space, notification } from 'antd';
import {
  DeleteOutlined,
  PlusOutlined,
  CloudUploadOutlined,
  CheckCircleOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setIsInProgress,
  setIsTimeout,
  setLogList,
} from '@src/renderer1/store/modules/testStatus';
import addLog from '@src/renderer1/store/asyncThunk/addLog';
import { setProjectList } from '@src/renderer1/store/modules/projectList';
import { setIsPermission } from '@src/renderer1/store/modules/home';

message.config({
  top: 100,
  maxCount: 1,
});
const { confirm, info } = Modal;
const { ipcRendererOn } = window.myApi;
const actionObj = {
  setIsInProgress,
  setIsTimeout,
  setLogList,
  setProjectList,
  addLog,
  setIsPermission,
};
export default function App() {
  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const dispatch = useDispatch();
  //设置接收主进程来的dispatch
  useEffect(() => {
    ipcRendererOn('dispatchAction', (e, data) => {
      const { key, value } = data;
      dispatch(actionObj[key](value));
    });
  }, []);
  //接收主进程推送过来的消息
  useEffect(() => {
    //接收后端通知在前端展示消息
    ipcRendererOn('showConfigError', async (e, data) => {
      notificationApi.error({
        message: 'Tip',
        description: String(data),
        duration: null,
      });
    });
  }, []);
  //noAuthentication
  useEffect(() => {
    //接收后端通知在前端展示消息
    ipcRendererOn('noAuthentication', async (e, data) => {
      const { description, message } = data;
      notificationApi.error({
        message,
        description,
        duration: null,
      });
    });
  }, []);
  return (
    <>
      {contextHolder}
      {notificationContextHolder}
      {modalContextHolder}
    </>
  );
}
