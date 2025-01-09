/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 11:28:23
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 14:05:21
 * @FilePath: \pxa_signal_analyzer\src\renderer\components\mainEvent\index.tsx
 * @Description: app辅助页面,处理main所有进程事件监听,无渲染逻辑
 */
import './index.scss';
import { Modal, message, notification } from 'antd';
import { useEffect } from 'react';
import { useAppDispatch } from '@src/renderer/hook';
import {
  setIsInProgress,
  setIsTimeout,
  setLogList,
} from '@src/renderer/store/modules/testStatus';
import addLog from '@src/renderer/store/asyncThunk/addLog';
import { setProjectList } from '@src/renderer/store/modules/projectList';
import { setIsPermission } from '@src/renderer/store/modules/home';
import { useNavigate } from 'react-router';
import { logChannel } from '@src/BroadcastChannel';
// 创建一个频道
const channel = new BroadcastChannel('my-channel');
message.config({
  top: 100,
  maxCount: 1,
});
const { confirm, info } = Modal;
const { ipcRendererOn, ipcRendererOnce } = window.myApi;
const actionObj = {
  setIsInProgress,
  setIsTimeout,
  setLogList,
  setProjectList,
  addLog,
  setIsPermission,
};
export default function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [modalApi, modalContextHolder] = Modal.useModal();
  const [messageApi, contextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  //设置接收主进程来的dispatch
  useEffect(() => {
    ipcRendererOn('dispatchAction', (e, data) => {
      const { key, value } = data;
      dispatch(actionObj[key](value));
    });
  }, []);
  //goHome
  useEffect(() => {
    ipcRendererOn('navigate', (e, data) => {
      //跳转首页
      navigate(data);
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
  //注册广播信道,准备接受addPage的消息
  useEffect(() => {
    // 监听来自 iframe2 的消息
    logChannel.addEventListener('message', (event) => {
      dispatch(addLog(event.data));
    });
    return () => {
      logChannel.removeEventListener('message', (event) => {});
    };
  }, []);
  return (
    <>
      {contextHolder}
      {notificationContextHolder}
      {modalContextHolder}
    </>
  );
}
