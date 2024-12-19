/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 11:11:05
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\projectListPage\cardExtra\index.jsx
 * @Description: 项目列表主表格
 */

import { Button, Space, Table, ConfigProvider, Card, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useMemo, lazy } from 'react';
import './index.scss';
import { useSelector, useDispatch } from 'react-redux';
import setCurrentRow from '@src/renderer/store/asyncThunk/setCurrentRow';
import { useNavigate } from 'react-router';
import TestListModal from './testListModal';
import { useTranslation } from 'react-i18next';
//封装过的确认弹窗
import modalConfirm from '@/utils/modalConfirm';
import { logError } from '@/utils/logLevel.js';

const { appConfigFilePath, ipcRenderer } = window.myApi;

export default ({ collapseFn, getProjectList, currentRow }) => {
  const { t, i18n } = useTranslation('testPage');

  const navigate = useNavigate();
  const [messageApi, messageContextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  //redux
  //是否正在测试
  const isInProgress = useSelector((state) => state.testStatus.isInProgress);
  //归档
  const archiveLoop = async (src, dest) => {
    try {
      await ipcRenderer.invoke('moveFile', { src, dest });
      return Promise.resolve();
    } catch (error) {
      if (String(error).includes('dest already exists')) {
        const newDest = `${dest}_${Date.now()}`;
        try {
          await ipcRenderer.invoke('moveFile', { src, dest: newDest });
          return Promise.resolve();
        } catch (error) {
          return Promise.reject(error);
        }
      } else {
        return Promise.reject(error);
      }
    }
  };
  const archiveFn = async () => {
    if (currentRow?.id) {
      try {
        await modalConfirm(
          `${t('archiveTooltip')} < ${currentRow.projectName} > ?`,
          '',
        );
        //开启Loading
        // React.switchLoading(true);
        const src = `${appConfigFilePath}/user/project/${currentRow.projectName}`;
        const dest = `${appConfigFilePath}/user/archive/${currentRow.projectName}`;
        await archiveLoop(src, dest);
        //通知父组件>更新项目列表
        getProjectList();
        //清除当前行
        dispatch(setCurrentRow({}));
        messageApi.success({
          duration: 5,
          content: '已归档',
        });
        // React.switchLoading(false);
      } catch (error) {
        // React.switchLoading(false);
        logError(error.toString());
        if (error !== '取消') {
          messageApi.error({
            duration: 5,
            content: String(error),
          });
        }
      }
    } else {
      messageApi.warning({
        duration: 5,
        content: t('operationProjectTooltip'),
      });
    }
  };
  const testListModalOpen = () => {
    if (currentRow?.id) {
      setModalVisible(true);
    } else {
      messageApi.warning({
        duration: 5,
        content: t('operationProjectTooltip'),
      });
    }
  };
  return (
    <div>
      {messageContextHolder}
      <Space>
        <Button
          type="link"
          size="small"
          onClick={testListModalOpen}
          disabled={isInProgress}
        >
          {t('testRecord')}
        </Button>
        {/* 归档 */}
        <Button
          type="link"
          size="small"
          onClick={archiveFn}
          disabled={isInProgress}
        >
          {t('archive')}
        </Button>
        {/* 调整宽度 */}
        <Button
          icon={<SwapOutlined />}
          type="link"
          size="small"
          onClick={collapseFn}
          disabled={isInProgress}
        ></Button>
      </Space>
      <TestListModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        currentRow={currentRow}
      ></TestListModal>
    </div>
  );
};
