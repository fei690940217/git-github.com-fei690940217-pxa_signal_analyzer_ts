/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2023-11-17 13:36:12
 * @FilePath: \fcc_5g_test_system\src\page\testPage\logCard\logList\logModal\index.jsx
 * @Description: log详情页
 */
import { RedoOutlined } from "@ant-design/icons";
import { useState, useEffect, useMemo } from "react";
import { Button, Input, Modal, Tooltip } from "antd";
import Store from "@/store";
import { cloneDeep } from "lodash";
import LogItem from "../logItem";
import "./index.scss";
import { useDebounce } from "ahooks";
const { getState } = Store;

export default ({ modalVisible, closeModal }) => {
  const [allLogList, setAllLogList] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const debouncedSearchKeyword = useDebounce(searchKeyword, { wait: 300 });

  //关键字过滤函数
  const filterLogList = useMemo(() => {
    if (debouncedSearchKeyword) {
      return allLogList.filter((item) => {
        // 使用 toLowerCase() 将搜索关键字和 log.message 转换为小写，以便忽略大小写进行匹配
        const lowerSearchKeyword = debouncedSearchKeyword.toLowerCase();
        const lowerMessage = item.message.toLowerCase();
        // 使用 String.includes() 方法检查 log.message 是否包含搜索关键字
        return lowerMessage.includes(lowerSearchKeyword);
      });
    } else {
      return allLogList;
    }
  }, [allLogList, debouncedSearchKeyword]);
  //模拟弹窗开启事件
  useEffect(() => {
    if (modalVisible) {
      getAllLogList();
    }
  }, [modalVisible]);
  const getAllLogList = () => {
    const rootState = getState();
    const tempList = rootState.testStatus.logList;
    const logList = cloneDeep(tempList);
    setAllLogList(logList);
  };
  const valueChange = (e) => {
    setSearchKeyword(e.target.value);
  };
  const modalTile = (
    <div className="title-wrapper">
      <div className="title-left">全部LOG详情</div>
      <div className="title-right">
        <div className="log-search-wrapper">
          <Tooltip title="刷新LOG">
            <Button
              shape="circle"
              icon={<RedoOutlined style={{ color: "#36c" }} />}
              size="small"
              onClick={getAllLogList}
            />
          </Tooltip>
          <Input
            style={{ marginLeft: 10 }}
            placeholder="search keyword"
            size="small"
            value={searchKeyword}
            onChange={valueChange}
          />
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      wrapClassName="log-modal-container"
      title={modalTile}
      open={modalVisible}
      footer={null}
      onCancel={closeModal}
      style={{ maxHeight: "90vh", minHeight: "30vh" }}
      centered={true}
      width={1000}
    >
      <div className="log-list-wrapper">
        {filterLogList.map((data) => {
          return (
            <div key={data.id}>
              <LogItem data={data} />
            </div>
          );
        })}
      </div>
    </Modal>
  );
};
