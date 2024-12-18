/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 11:29:42
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\planTableCard\statusBar\index.jsx
 * @Description: 主测试模块
 */

import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import {
  App,
  Tag,
  Tooltip,
  Popconfirm,
  Select,
  Button,
  Switch,
  Divider,
} from "antd";
import {
  CaretRightOutlined,
  SyncOutlined,
  PauseOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  setIsInProgress,
  setCurrentTestRecordName,
} from "@/store/modules/testStatus";

import { useTranslation } from "react-i18next";
import HandleButton from "./handleButton";
import AddSubModal from "./addSubModal";
import modalConfirm from "@/utils/modalConfirm";
import { logInfo, logError } from "@/utils/logLevel.js";

const { ipcRenderer } = window.myApi;

const CardExtra = ({ currentSelectedItem }) => {
  const { t, i18n } = useTranslation("testPage");
  const { message, modal, notification } = App.useApp();
  const dispatch = useDispatch();
  //当前选中行的数据
  const currentRow = useSelector((state) => state.projectList.currentRow);
  //当前是否在测试中
  const isInProgress = useSelector((state) => state.testStatus.isInProgress);
  const currentTestRecordName = useSelector(
    (state) => state.testStatus.currentTestRecordName
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [subProjectList, setSubProjectList] = useState([]);

  //结束测试
  const abortTest = async () => {
    try {
      if (isInProgress) {
        await modalConfirm("确认结束测试?", "");
        await dispatch(setIsInProgress(false));
        //通知main进程kill测试进程
        ipcRenderer.send("abortTest");
      }
    } catch (error) {
      logError(error.toString());
    }
  };
  const handleChange = (value) => {
    dispatch(setCurrentTestRecordName(value));
  };
  //获取测试列表
  const getSubProjectList = async () => {
    if (currentRow?.id) {
      const list = await ipcRenderer.invoke(
        "getSubProjectList",
        currentRow.projectName
      );
      setSubProjectList(list);
    }
  };
  useEffect(() => {
    getSubProjectList();
  }, [currentRow, currentTestRecordName]);
  //新建子项目
  const addSubProject = async () => {
    setModalVisible(true);
  };
  return (
    <div className="status-bar-wrapper">
      <AddSubModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      ></AddSubModal>
      <div className="status-bar-left">
        <span style={{ marginRight: 10, fontWeight: 600, fontSize: 16 }}>
          {t("currentProject")}:
        </span>

        <span style={{ fontWeight: 400, fontSize: 14 }}>
          {currentRow.projectName ? currentRow.projectName : "无"}
        </span>
        <span style={{ margin: "0 5px" }}>/</span>
        <Select
          disabled={isInProgress}
          size="small"
          value={currentTestRecordName}
          style={{
            width: 180,
          }}
          onChange={handleChange}
          options={subProjectList}
          fieldNames={{ label: "subProjectName", value: "subProjectName" }}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: "8px 0" }} />
              <Button
                block
                type="primary"
                ghost
                icon={<PlusOutlined />}
                onClick={addSubProject}
              >
                新建子项目
              </Button>
            </>
          )}
        />
        {/* <span>{currentTestRecordName}</span> */}
      </div>
      <div className="status-bar-right">
        <div className="start-button-wrapper status-bar-right-item">
          <HandleButton currentSelectedItem={currentSelectedItem} />
        </div>
        <div className="stop-button-wrapper status-bar-right-item">
          {/* 确认结束测试 */}
          <i
            onClick={abortTest}
            className="iconfont  icon-24gf-stop"
            style={{
              fontSize: 20,
              color: "#990033",
              cursor: "pointer",
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default (props) => (
  <App>
    <CardExtra {...props} />
  </App>
);
