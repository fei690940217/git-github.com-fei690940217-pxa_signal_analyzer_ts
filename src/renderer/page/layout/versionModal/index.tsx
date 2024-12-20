/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 16:14:12
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\layout\versionModal\index.tsx
 * @Description: 项目列表主表格
 */

import { Modal } from 'antd';
import { useState, useEffect } from 'react';
import './index.scss';
const { ipcRenderer } = window.myApi;
interface VersionItemType {
  version: string; // 版本号
  releaseDate: string; // 发布日期，格式为 YYYY-MM-DD
  updateContent: string[]; // 更新内容的列表
  supplement: string[]; // 补充信息
}
const LogItem = ({ data }: { data: VersionItemType }) => {
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
type PropsType = {
  modalVisible: boolean | undefined;
  closeModal: () => void;
};

export default ({ modalVisible, closeModal }: PropsType) => {
  //本弹窗内的选择项
  const [logList, setLogList] = useState<VersionItemType[]>([]);
  //弹窗打开事件
  const dialogOpen = async () => {
    try {
      const list = await ipcRenderer.invoke('getJsonFile', {
        type: 'changeLog',
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
      style={{ maxHeight: '90vh' }}
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
