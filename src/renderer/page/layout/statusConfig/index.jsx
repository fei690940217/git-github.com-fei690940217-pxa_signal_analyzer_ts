/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\layout\statusConfig\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-09 13:58:21
 * @Descripttion:  基站设置
 */
import { Form, message, Card, Tag, Tooltip, Space, notification } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WifiOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { setIsPermission } from "@/store/modules/home";

import { useNetwork } from "ahooks";
import { check_auth } from "@/api/api";
import { useTranslation } from "react-i18next";
import { logError } from "@/utils/logLevel.js";

const App = () => {
  const { t, i18n } = useTranslation("setPage");

  const dispatch = useDispatch();
  const [messageApi, messageContextHolder] = message.useMessage();
  const { online } = useNetwork();
  const isPermission = useSelector((state) => state.home.isPermission);

  //获取授权
  const getAuthorization = async () => {
    try {
      if (online) {
        let rst = await check_auth();
        if (rst) {
          dispatch(setIsPermission(false));
          notification.info({
            message: `授权码 ${rst}`,
            description: "请通知管理员授权电脑",
            duration: null,
          });
        } else {
          dispatch(setIsPermission(true));
          messageApi.success("Success");
        }
      } else {
        messageApi.error("请确保连接网络");
      }
    } catch (error) {
      logError(error.toString());
    }
  };
  return (
    <div className="status-content">
      {/* 网络状态 */}
      <div>
        {online ? (
          <Tag icon={<WifiOutlined />} color="#55acee">
            已联网
          </Tag>
        ) : (
          <Tag icon={<GlobalOutlined />} color="#cd201f">
            无网络
          </Tag>
        )}
      </div>

      {/* 授权 */}
      {/* 网络状态 */}
      <div>
        {isPermission ? (
          <Tag
            icon={<CheckCircleOutlined />}
            color="#55acee"
            onClick={getAuthorization}
          >
            已授权
          </Tag>
        ) : (
          <Tooltip title="点击获取授权">
            <Tag
              icon={<CloseCircleOutlined />}
              color="#cd201f"
              onClick={getAuthorization}
            >
              无授权
            </Tag>
          </Tooltip>
        )}
      </div>
    </div>
  );
};
export default App;
