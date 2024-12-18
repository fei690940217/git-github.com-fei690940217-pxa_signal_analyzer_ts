/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-11 16:11:38
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\RBPlanTable\index.jsx
 * @Description: 勾选测试项页面
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import { Card, Tabs, Button, Form } from "antd";
import RBTableItem from "./RBTableItem";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
const { ipcRenderer } = window.myApi;

export default ({ addFormValues, RBSelectedRowKeys, setRBSelectedRowKeys }) => {
  const { t, i18n } = useTranslation("addPage");
  const dispatch = useDispatch();
  const currentRow = useSelector((state) => state.projectList.currentRow);
  const { testItems } = addFormValues;
  //更新配置文件
  const refreshConfig = () => {
    ipcRenderer.send("refreshConfigFile");
  };
  return (
    <div className="add-project-sup-test-plan-wrapper">
      <Card
        title="RB Config"
        extra={
          <Button type="link" onClick={refreshConfig}>
            {t("refreshConfig")}
          </Button>
        }
        styles={{
          header: {
            minHeight: 36,
            padding: "0 5px",
          },
          body: {
            padding: "0 5px 5px 5px",
          },
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <RBTableItem
          testItem={testItems}
          RBSelectedRowKeys={RBSelectedRowKeys}
          setRBSelectedRowKeys={setRBSelectedRowKeys}
        />
      </Card>
    </div>
  );
};
