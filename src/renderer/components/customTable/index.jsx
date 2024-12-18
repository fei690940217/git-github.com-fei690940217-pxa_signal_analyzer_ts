/*
 * @FilePath: \fcc_5g_test_system\src\components\customTable\index.jsx
 * @Author: xxx
 * @Date: 2023-04-19 17:08:30
 * @LastEditors: xxx
 * @LastEditTime: 2023-04-19 17:08:43
 * @Descripttion: 
 */
import { Button, ConfigProvider } from 'antd';
import React from 'react';

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#00b96b',
      },
    }}
  >
    <Button />
  </ConfigProvider>
);

export default App;