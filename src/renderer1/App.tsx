/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 11:28:23
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-31 11:57:54
 * @FilePath: \pxa_signal_analyzer\src\renderer1\App.tsx
 * @Description: app.js
 */
import 'antd/dist/reset.css';
import MainEvent from '@src/renderer1/page/mainEvent';
import AddPage from '@src/renderer1/page/addPage';
import { Suspense } from 'react';
import Loading from '@src/renderer1/page/loading';
export default function App() {
  return (
    <Suspense fallback={<Loading tip="Loading ..." />}>
      <MainEvent />
      <AddPage />
    </Suspense>
  );
}
