/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-09 11:15:35
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\layout\versionModal\index.jsx
 * @Description: 项目列表主表格
 */

import {
  Button,
  Table,
  message,
  Modal,
  Checkbox,
  Radio,
  Divider,
  Tooltip,
  Popover,
  Select,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect, useMemo, lazy } from "react";
import "./index.scss";
import Axios from "axios";
const { appConfigFilePath, ipcRenderer } = window.myApi;

const LogItem = ({ data }) => {
  const { version, releaseDate, updateContent, supplement } = data;
  return (
    <div className="log-item-container">
      <h2 className="log-item-header">
        <span>Version</span>
        <span>{version}</span>
        <span>-</span>
        <span>{releaseDate}</span>
      </h2>
      <div className="log-item-content">
        <div>
          <h3>更新内容</h3>
          <ul>
            {updateContent.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>补充说明</h3>
          <ul>
            {supplement.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
export default ({ modalVisible, closeModal }) => {
  //本弹窗内的选择项
  const [modalSelectBand, setModalSelectBand] = useState([]);
  const [LTEBandModalVisible, setLTEBandModalVisible] = useState(false);
  const [logList, setLogList] = useState([]);
  //弹窗打开事件
  const dialogOpen = async () => {
    try {
      const list = await ipcRenderer.invoke("getJsonFile", {
        type: "changeLog",
      });
      setLogList(list);
    } catch (error) {
      setLogList([]);
    }
  };
  useEffect(() => {
    if (modalVisible) {
      dialogOpen();
    }
  }, [modalVisible]);
  return (
    <Modal
      title="Change-Log"
      open={modalVisible}
      onCancel={closeModal}
      style={{ maxHeight: "90vh" }}
      centered={true}
      wrapClassName="change-log-modal-wrapper"
      width={900}
      footer={null}
    >
      <div className="change-log-modal-content">
        {logList.map((item) => {
          return <LogItem data={item} key={item.releaseDate}></LogItem>;
        })}
      </div>
    </Modal>
  );
};
