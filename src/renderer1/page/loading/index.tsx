/*
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\loading\index.tsx
 * @Author: xxx
 * @Date: 2023-04-06 11:42:18
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 16:59:37
 * @Descripttion:  加载中页面
 */
import React, { memo } from 'react';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './index.scss';
const Loading = ({ tip }: { tip: string }) => {
  return (
    <div className="custom-loading-wrapper">
      <div className="custom-loading-content">
        <div
          style={{
            color: '#36c',
            textAlign: 'center',
            marginBottom: 16,
            fontSize: 28,
          }}
        >
          <LoadingOutlined />
        </div>
        <div style={{ color: '#36c' }}>{tip}</div>
      </div>
    </div>
  );
};

export default Loading;
