/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\planTableCard\resultTable\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 14:59:30
 * @Descripttion:
 */
import { Image, message, ConfigProvider, Table, notification } from "antd";
import { useState, useEffect, useMemo, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./index.scss";
import ColumnsHandle from "./column";
import addLog from "@/store/asyncThunk/addLog";
import { logError } from "@/utils/logLevel.js";
const { fsPromises, appConfigFilePath, ipcRenderer, fs, ipcRendererOn } =
  window.myApi;

const App = ({
  selectedListItem,
  setSelectedListItem,
  currentResult,
  refreshCurrentResult,
}) => {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const currentRow = useSelector((state) => state.projectList.currentRow);
  //测试用例
  const testItem = currentResult[0]?.testItem || "";
  //展示截图
  const showScreenCapture = async (id) => {
    try {
      const imgFilePath = `${appConfigFilePath}/user/project/${currentRow.projectName}/${currentTestRecordName}/img/${id}.png`;
      const imgBase64 = await fsPromises.readFile(imgFilePath, "base64");
      const prefix = "data:image/png;base64,";
      const resultData = prefix + imgBase64;
      setImgSrc(resultData);
      setVisible(true);
    } catch (error) {
      logError(error.toString());
      messageApi.error("无法预览,请检查图片是否存在");
    }
  };
  //删除某一条的结果
  const deleteResult = async (row) => {
    try {
      const resultFilePath = `${appConfigFilePath}/user/project/${currentRow.projectName}/${currentTestRecordName}/result.json`;
      await ipcRenderer.invoke("deleteResult", {
        resultFilePath,
        row,
      });
      messageApi.success("已删除");
      //添加log
      const log = `warning_-_id为${row.id}的测试条目,结果已删除`;
      dispatch(addLog(log));
      refreshCurrentResult();
    } catch (error) {
      logError(error.toString());
      notification.error({
        message: "Error",
        description: error.toString(),
      });
    }
  };
  const columns = ColumnsHandle(testItem, showScreenCapture, deleteResult);
  //请前测试记录文件夹名称
  const currentTestRecordName = useSelector(
    (state) => state.testStatus.currentTestRecordName
  );
  //展示截图使用
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  const tableRowSelection = {
    type: "radio",
    selectedRowKeys: selectedListItem,
    onChange: (selectedRowKeys) => {
      if (currentTestRecordName) {
        setSelectedListItem(selectedRowKeys);
      }
    },
  };
  return (
    <div className="all-result-table-wrapper">
      {contextHolder}
      <div className="all-result-table-content">
        <ConfigProvider
          theme={{
            token: {
              colorBorderSecondary: "#ccc",
            },
          }}
        >
          <Table
            rowSelection={tableRowSelection}
            bordered
            style={{ height: "100%", width: "100%", overflow: "hidden" }}
            size="small"
            dataSource={currentResult}
            rowKey="id"
            pagination={false}
            scroll={{ y: "" }}
            columns={columns}
          ></Table>
        </ConfigProvider>
      </div>
      {/* 截图预览 */}
      <Image
        style={{
          display: "none",
        }}
        preview={{
          visible,
          src: imgSrc,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
    </div>
  );
};
export default App;
