/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\router\index.tsx
 * @Author: xxx
 * @Date: 2023-02-23 17:55:33
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 14:46:47
 * @Descripttion:
 */
import { RouteObject } from 'react-router';
import { lazy } from 'react';
// import Home from '@/page/HomeIndex/index'
//错误页
import Error from '@/page/error/index';
//主体布局页面
import Layout from '@/page/layout/index';
//测试页并且是默认主页
import TestPage from '@/page/testPage';
//新建项目
const AddPage = lazy(() => import('@/page/addPage'));
//设置
const SetPage = lazy(() => import('@/page/setPage'));
//demo
const DemoPage = lazy(() => import('@/page/demoPage'));
// 项目管理
const ProjectManage = lazy(() => import('@/page/projectManage'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        //默认组件
        index: true,
        // path: "/",
        element: <TestPage></TestPage>,
      },
      {
        path: '/projectManage',
        element: <ProjectManage />,
      },
      {
        path: '/add',
        element: <AddPage></AddPage>,
      },
      {
        path: '/set',
        element: <SetPage></SetPage>,
      },
      {
        path: '/demo',
        element: <DemoPage></DemoPage>,
      },
    ],
  },
  {
    path: '*',
    element: <Error></Error>,
  },
];

export default routes;
