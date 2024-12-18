/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-09-30 11:18:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 11:09:43
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\layout\footerNotice\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect, useMemo } from "react";

import { message } from "antd";
import "./index.scss";
import { throttle } from "lodash";

const { ipcRendererOn } = window.myApi;

export default function Counter() {
  const [messageApi, contextHolder] = message.useMessage();
  const openMessage = throttle((data) => {
    messageApi.open(data);
  }, 3000);
  useEffect(() => {
    //接收后端错误在footer展示,便于用户观察
    ipcRendererOn("showMessage", (e, data) => {
      openMessage(data);
    });
  }, []);

  const clickk = () => {};
  return (
    <div className="footer-notice-content" onClick={clickk}>
      {contextHolder}
    </div>
  );
}
