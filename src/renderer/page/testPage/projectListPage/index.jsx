/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-11 17:09:32
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\projectListPage\index.jsx
 * @Description: 项目列表主表格
 */

import { Table, ConfigProvider, Card, message } from "antd";
import React, { useState, useEffect } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentRow, setProjectList } from "@/store/modules/projectList";
import CardExtra from "./cardExtra";
import { useTranslation } from "react-i18next";
import { logError } from "@/utils/logLevel.js";
const { ipcRenderer } = window.myApi;

const { Column } = Table;
export default () => {
  const { t, i18n } = useTranslation("testPage");
  const [messageApi, messageContextHolder] = message.useMessage();
  const dispatch = useDispatch();
  //redux- projectList
  const currentRow = useSelector((state) => state.projectList.currentRow);
  const projectList = useSelector((state) => state.projectList.projectList);
  //是否正在测试
  const isInProgress = useSelector((state) => state.testStatus.isInProgress);
  const [bodyWidth, setBodyWidth] = useState(360);
  const getProjectList = async () => {
    try {
      const list = await ipcRenderer.invoke("getJsonFile", {
        type: "projectList",
      });
      dispatch(setProjectList(list));
    } catch (error) {
      logError(`获取项目列表失败: ${error.toString()}`);
      dispatch(setProjectList([]));
    }
  };
  const updateProjectList = async (result) => {
    try {
      await ipcRenderer.invoke("setJsonFile", {
        type: "projectList",
        params: {
          result,
        },
      });
      getProjectList();
    } catch (error) {
      logError(error.toString());
    }
  };
  useEffect(() => {
    getProjectList();
  }, []);
  const tableRowSelection = {
    type: "checkbox",
    hideSelectAll: true,
    columnTitle: "/",
    columnWidth: 30,
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRowKeys.length) {
        let len = selectedRowKeys.length - 1;
        dispatch(setCurrentRow(selectedRows[len]));
      } else {
        dispatch(setCurrentRow({}));
      }
    },
    //默认选中项的数组列表
    // defaultSelectedRowKeys,
    selectedRowKeys: [currentRow.id],
    getCheckboxProps: (record) => ({
      //如果进行中禁止修改选中行
      disabled: isInProgress,
    }),
  };
  const collapseFn = () => {
    setBodyWidth(bodyWidth === 360 ? 180 : 360);
  };
  return (
    <Card
      className="project-list-card"
      styles={{
        header: { minHeight: 36, lineHeight: "36px", padding: "0 12px" },
        body: { padding: "12px 0" },
      }}
      style={{ width: bodyWidth }}
      title={t("projectList")}
      extra={
        <CardExtra
          collapseFn={collapseFn}
          updateProjectList={updateProjectList}
          projectList={projectList}
          currentRow={currentRow}
        />
      }
    >
      {messageContextHolder}
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: "#ccc",
          },
        }}
      >
        <Table
          className="project-list-table"
          rowSelection={tableRowSelection}
          style={{ height: "100%", overflow: "hidden" }}
          size="small"
          dataSource={projectList}
          rowKey={(row) => row.id}
          bordered
          pagination={false}
          scroll={{
            y: "100%",
          }}
        >
          {/* 序号 */}
          <Column
            align="center"
            width={40}
            title="No."
            render={(a, b, index) => <>{index + 1}</>}
          />
          {/* 项目名称 */}
          <Column
            title={t("projectName")}
            dataIndex="projectName"
            key="projectName"
            ellipsis={true}
          />
        </Table>
      </ConfigProvider>
    </Card>
  );
};
