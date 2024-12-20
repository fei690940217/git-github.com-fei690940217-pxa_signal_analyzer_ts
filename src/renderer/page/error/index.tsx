/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-06-22 13:20:56
 * @LastEditors: xxx
 * @LastEditTime: 2023-04-18 14:02:21
 * @FilePath: \fcc_5g_test_system\src\page\error\index.jsx
 * @Description: 错误页
 */
import React, { useState } from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router';

export default () => {
  const navigate = useNavigate();
  const refresh = () => {
    navigate('/');
  };

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Result
        status="403"
        title="403"
        subTitle="系统错误,请刷新或联系管理员"
        extra={
          <Button type="primary" onClick={refresh}>
            刷新
          </Button>
        }
      />
    </div>
  );
};
