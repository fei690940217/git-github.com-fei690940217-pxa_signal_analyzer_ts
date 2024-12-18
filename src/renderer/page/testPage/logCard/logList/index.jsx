/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\testPage\logCard\logList\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-17 10:55:30
 * @Descripttion:
 */
import { Tooltip, Button } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import { setLogList, setLocalLogList } from "@/store/modules/testStatus";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./index.scss";
import LogModal from "./logModal";
import LogItem from "./logItem";
import logLevel from "loglevel";
const App = () => {
  const dispatch = useDispatch();
  const localLogList = useSelector((state) => state.testStatus.localLogList);
  const [modalVisible, setModalVisible] = useState(false);
  const deleteLog = () => {
    dispatch(setLogList([]));
    dispatch(setLocalLogList([]));
  };
  //查看全部Log
  const viewAllLog = () => {
    setModalVisible(true);
  };
  return (
    <div className="log-list-container">
      <LogModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
      ></LogModal>
      <div className="log-list-title">
        <div className="log-list-title-text">
          <span className="text">Log</span>
        </div>
        <div className="log-list-title-handle">
          <div className="log-search-wrapper">
            <Tooltip title="Clear log" color="#F56C6C">
              <Button
                shape="circle"
                icon={<DeleteOutlined style={{ color: "#F56C6C" }} />}
                size="small"
                onClick={deleteLog}
              />
            </Tooltip>
            <Tooltip title="查看全部LOG">
              <Button
                style={{ marginLeft: 30 }}
                shape="circle"
                icon={<EyeOutlined style={{ color: "#36c" }} />}
                size="small"
                onClick={viewAllLog}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      {/* 操作按钮区域 */}

      <div className="log-list-wrapper">
        {localLogList.map((data) => {
          return (
            <div key={data.id}>
              <LogItem data={data} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default App;
