/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 11:28:23
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 14:22:56
 * @FilePath: \pxa_signal_analyzer\src\renderer\App.tsx
 * @Description: app.js
 */
import 'antd/dist/reset.css';
import MainEvent from '@/components/mainEvent';
import routers from './router';
import { Suspense } from 'react';
import { useRoutes } from 'react-router';
import Loading from '@/components/loading';
import { notification } from 'antd';
import NotificationApi from './components/NotificationApi';
notification.config({
  maxCount: 1,
});
export default function App() {
  const [api, contextHolder] = notification.useNotification();
  NotificationApi.set(api);
  const element = useRoutes(routers);
  return (
    <Suspense fallback={<Loading tip="Loading ..." />}>
      {contextHolder}
      <MainEvent></MainEvent>
      {element}
    </Suspense>
  );
}
