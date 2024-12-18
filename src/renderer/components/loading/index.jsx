/*
 * @FilePath: \fcc_5g_test_system\src\components\loading\index.jsx
 * @Author: xxx
 * @Date: 2023-04-06 11:42:18
 * @LastEditors: feifei
 * @LastEditTime: 2023-07-19 14:45:47
 * @Descripttion:  加载中页面
 */
import React, { memo } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import "./index.scss";
const Loading = ({ tip }) => {
  return (
    <div className="custom-loading-wrapper">
      <div className="custom-loading-content">
        <div
          style={{
            color: "#36c",
            textAlign: "center",
            marginBottom: 16,
            fontSize: 28,
          }}
        >
          <LoadingOutlined />
        </div>
        <div style={{ color: "#36c" }}>{tip}</div>
      </div>
    </div>
  );
};

export default Loading;
