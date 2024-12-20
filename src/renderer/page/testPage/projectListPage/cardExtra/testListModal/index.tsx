/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 15:59:09
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\projectListPage\cardExtra\testListModal\index.tsx
 * @Description: 项目列表主表格
 */

import { Button, Table, message, Modal } from 'antd';
import React, { useState, useEffect } from 'react';
import './index.scss';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';
import { logError } from '@/utils/logLevel';
import { ProjectItemType, SubProjectItemType } from '@src/customTypes/renderer';

const { Column } = Table;
const { ipcRenderer } = window.myApi;
type PropsType = {
  modalVisible: boolean;
  closeModal: () => void;
  currentRow: ProjectItemType | null;
};
export default ({ modalVisible, closeModal, currentRow }: PropsType) => {
  const { t, i18n } = useTranslation('testPage');
  const [messageApi, messageContextHolder] = message.useMessage();
  const [subProjectList, setSubProjectList] = useState<SubProjectItemType[]>(
    [],
  );
  useEffect(() => {
    if (modalVisible) {
      getSubProjectList();
    }
  }, [modalVisible]);

  //获取测试列表
  const getSubProjectList = async () => {
    console.log('getSubProjectList', currentRow);
    if (currentRow?.id) {
      const list = await ipcRenderer.invoke(
        'getSubProjectList',
        currentRow.projectName,
      );
      setSubProjectList(list);
    }
  };

  //生成报告
  const generateReport = async (subProjectName: string) => {
    try {
      if (currentRow?.id) {
        await ipcRenderer.invoke('generateDocx', {
          projectName: currentRow.projectName,
          testItem: currentRow.formValue.testItems,
          subProjectName: subProjectName,
        });
        messageApi.success('S U C C E S S');
      }
    } catch (error) {
      logError(String(error));
      messageApi.error(String(error));
    }
  };

  const handleColumnRender = (
    _text: any,
    record: SubProjectItemType,
    _index: any,
  ) => {
    return (
      <Button type="link" onClick={() => generateReport(record.subProjectName)}>
        {/* 生成报告 */}
        {t('generateReport')}
      </Button>
    );
  };
  const openDir = (subProjectName: string) => {
    ipcRenderer.send('showItemInFolder', {
      projectName: currentRow?.projectName,
      subProjectName,
    });
  };
  const openDirColumnRender = (_text: any, record: SubProjectItemType) => {
    return (
      <Button type="link" onClick={() => openDir(record.subProjectName)}>
        {/* 打开文件夹 */}
        {t('openFolder')}
      </Button>
    );
  };
  const createTimeRender = (text: string) => {
    return Moment(text).format('YYYY-MM-DD HH:mm');
  };
  return (
    <Modal
      width={720}
      title={`${currentRow?.projectName}`}
      open={modalVisible}
      footer={null}
      onCancel={closeModal}
      style={{ maxHeight: '90vh' }}
      centered={true}
      wrapClassName="test-list-modal-wrapper"
    >
      <div className="test-list-modal-table-wrapper">
        {messageContextHolder}
        <Table
          size="small"
          dataSource={subProjectList}
          rowKey="id"
          bordered
          pagination={false}
          scroll={{
            y: 400,
          }}
        >
          {/* 序号 */}
          <Column
            align="center"
            width={40}
            title="No."
            render={(a, b, index) => <>{index + 1}</>}
          />
          {/* 结果result */}
          <Column
            title={t('testName')}
            dataIndex="subProjectName"
            key="subProjectName"
            ellipsis={true}
          />
          {/* 结果result */}
          <Column
            width={140}
            title="创建时间"
            dataIndex="createTime"
            key="createTime"
            ellipsis={true}
            render={createTimeRender}
          />
          {/* 操作 */}
          <Column
            align="center"
            width={110}
            title="/"
            ellipsis={true}
            render={handleColumnRender}
          />
          {/* 操作 */}
          <Column
            align="center"
            width={110}
            title="/"
            ellipsis={true}
            render={openDirColumnRender}
          />
        </Table>
      </div>
    </Modal>
  );
};
