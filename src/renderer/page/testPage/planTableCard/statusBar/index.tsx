/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 17:04:57
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\planTableCard\statusBar\index.tsx
 * @Description: 主测试模块
 */

import { useEffect, useState } from 'react';
import './index.scss';
import { App, Select, Button, Divider } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  setIsInProgress,
  setCurrentTestRecordName,
} from '@/store/modules/testStatus';

import { useTranslation } from 'react-i18next';
import HandleButton from './handleButton';
import AddSubModal from './addSubModal';
import modalConfirm from '@/utils/modalConfirm';
import { logError } from '@/utils/logLevel';
import { ResultItemType } from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';

const { ipcRenderer } = window.myApi;

const CardExtra = ({
  currentSelectedItem,
}: {
  currentSelectedItem: ResultItemType | null;
}) => {
  const { t, i18n } = useTranslation('testPage');
  const { message, modal, notification } = App.useApp();
  const dispatch = useAppDispatch();
  //当前选中行的数据
  const currentRow = useAppSelector((state) => state.projectList.currentRow);
  //当前是否在测试中
  const isInProgress = useAppSelector((state) => state.testStatus.isInProgress);
  const currentTestRecordName = useAppSelector(
    (state) => state.testStatus.currentTestRecordName,
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [subProjectList, setSubProjectList] = useState([]);

  //结束测试
  const abortTest = async () => {
    try {
      if (isInProgress) {
        await modalConfirm('确认结束测试?', '');
        await dispatch(setIsInProgress(false));
        //通知main进程kill测试进程
        ipcRenderer.send('abortTest');
      }
    } catch (error) {
      logError(error?.toString());
    }
  };
  const handleChange = (value: string) => {
    dispatch(setCurrentTestRecordName(value));
  };
  //获取测试列表
  const getSubProjectList = async () => {
    if (currentRow?.id) {
      const list = await ipcRenderer.invoke(
        'getSubProjectList',
        currentRow.projectName,
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
          {t('currentProject')}:
        </span>

        <span style={{ fontWeight: 400, fontSize: 14 }}>
          {currentRow?.projectName || '无'}
        </span>
        <span style={{ margin: '0 5px' }}>/</span>
        <Select
          disabled={isInProgress}
          size="small"
          value={currentTestRecordName}
          style={{
            width: 180,
          }}
          onChange={handleChange}
          options={subProjectList}
          fieldNames={{ label: 'subProjectName', value: 'subProjectName' }}
          dropdownRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
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
              color: '#990033',
              cursor: 'pointer',
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default (props: { currentSelectedItem: ResultItemType | null }) => (
  <App>
    <CardExtra {...props} />
  </App>
);
