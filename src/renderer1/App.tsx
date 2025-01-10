/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 11:28:23
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 16:20:49
 * @FilePath: \pxa_signal_analyzer\src\renderer1\App.tsx
 * @Description: app.js
 */
import 'antd/dist/reset.css';
import AddPage from '@src/renderer1/page/addPage';
import { Suspense, useEffect } from 'react';
import Loading from '@src/renderer1/page/loading';
import { Button, notification } from 'antd';
const { ipcRendererOn } = window.myApi;
export default function App() {
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
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
  return (
    <Suspense fallback={<Loading tip="Loading ..." />}>
      {notificationContextHolder}
      <AddPage />
    </Suspense>
  );
}
