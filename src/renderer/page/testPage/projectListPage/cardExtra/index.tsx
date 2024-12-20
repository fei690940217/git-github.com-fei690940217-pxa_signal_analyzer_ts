/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 15:47:58
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\projectListPage\cardExtra\index.tsx
 * @Description: 项目列表主表格
 */

import { Button, Space, message } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './index.scss';
import setCurrentRow from '@src/renderer/store/asyncThunk/setCurrentRow';
import TestListModal from './testListModal';
import { useTranslation } from 'react-i18next';
//封装过的确认弹窗
import modalConfirm from '@/utils/modalConfirm';
import { logError } from '@/utils/logLevel';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';
import { ProjectItemType } from '@src/customTypes/renderer';
const { ipcRenderer } = window.myApi;
type PropsType = {
  collapseFn: () => void;
  getProjectList: () => void;
  currentRow: ProjectItemType | null;
};
export default ({ collapseFn, getProjectList, currentRow }: PropsType) => {
  const { t, i18n } = useTranslation('testPage');
  const dispatch = useAppDispatch();
  const [messageApi, messageContextHolder] = message.useMessage();

  const [modalVisible, setModalVisible] = useState(false);
  //redux
  //是否正在测试
  const isInProgress = useAppSelector((state) => state.testStatus.isInProgress);
  //归档
  const archiveFn = async () => {
    if (currentRow?.id) {
      try {
        await modalConfirm(
          `${t('archiveTooltip')} < ${currentRow.projectName} > ?`,
          '',
        );
        await ipcRenderer.invoke('archiveProject', currentRow.projectName);
        //通知父组件>更新项目列表
        getProjectList();
        //清除当前行
        dispatch(setCurrentRow(null));
        messageApi.success({
          duration: 5,
          content: '已归档',
        });
      } catch (error) {
        logError(error?.toString());
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
