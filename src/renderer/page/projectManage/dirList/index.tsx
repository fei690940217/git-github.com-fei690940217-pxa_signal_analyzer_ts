/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 17:12:53
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\projectManage\dirList\index.tsx
 * @Description: 目录管理
 */

import { Table, ConfigProvider, Card, message, Button, Flex } from 'antd';
import type { TableProps } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteTwoTone,
  HddTwoTone,
} from '@ant-design/icons';
import { useState, useEffect } from 'react';
import './index.scss';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';
import { useTranslation } from 'react-i18next';
import { logError } from '@/utils/logLevel';
import { AddDirType } from '@src/customTypes';

import modalConfirm from '@src/renderer/utils/modalConfirm';
import AddDirModal from './addDirModal';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];
const { ipcRenderer } = window.myApi;
const { Column } = Table;
type PropsType = {
  currentDir: AddDirType | null;
  setCurrentDir: (params: AddDirType | null) => void;
};
export default ({ currentDir, setCurrentDir }: PropsType) => {
  const { t, i18n } = useTranslation('testPage');
  const [messageApi, messageContextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  //redux- projectList
  //是否正在测试
  const isInProgress = useAppSelector((state) => state.testStatus.isInProgress);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [dirList, setDirList] = useState<AddDirType[]>([]);

  const getProjectList = async () => {
    try {
      const list = await ipcRenderer.invoke('getJsonFile', {
        type: 'projectList',
      });
      setDirList(list);
    } catch (error) {
      logError(`获取项目列表失败: ${error?.toString()}`);
      setDirList([]);
    }
  };
  const init_fn = async () => {
    try {
      //获取项目列表
      const list: AddDirType[] = await ipcRenderer.invoke('getJsonFile', {
        type: 'projectList',
      });
      setDirList(list);
    } catch (error) {
      console.log(error);
    }
  };
  //初始化操作
  useEffect(() => {
    init_fn();
  }, []);
  const tableRowSelection: TableRowSelection<AddDirType> = {
    type: 'checkbox',
    hideSelectAll: true,
    columnTitle: '/',
    columnWidth: 30,
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRowKeys.length) {
        let len = selectedRowKeys.length - 1;
        setCurrentDir(selectedRows[len]);
      } else {
        setCurrentDir(null);
      }
    },
    selectedRowKeys: [currentDir?.id || ''],
  };
  //归档
  const archiveFn = async () => {
    if (currentDir?.id) {
      try {
        await modalConfirm(`确认归档 < ${currentDir.dirName} > ?`, '');
        await ipcRenderer.invoke('archiveDir', currentDir.dirName);
        //通知父组件>更新项目列表
        getProjectList();
        //清除当前行
        setCurrentDir(null);
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
        content: '请选择一个目录操作',
      });
    }
  };
  const addFn = () => {
    setModalVisible(true);
  };
  const deleteFn = async () => {
    if (currentDir?.id) {
      try {
        await modalConfirm(
          `确认删除 < ${currentDir.dirName} > ?`,
          '永久性操作,不可在回收站找回,请谨慎操作!',
        );
        await ipcRenderer.invoke('removeDir', currentDir.dirName);
        //通知父组件>更新项目列表
        getProjectList();
        //清除当前行
        setCurrentDir(null);
        messageApi.success({
          duration: 5,
          content: '已删除',
        });
      } catch (error) {
        logError(error?.toString());
      }
    } else {
      messageApi.warning({
        duration: 5,
        content: '请选择一个目录操作',
      });
    }
  };
  return (
    <Card
      className="dir-manage-card manage-card-item"
      styles={{
        header: { minHeight: 36, lineHeight: '36px', padding: '0 8px' },
        body: { padding: 8 },
      }}
      title={
        <Flex gap={20}>
          <h2 style={{ fontSize: 16, margin: 0 }}>目录管理</h2>
          <Flex gap={8} align="center">
            <Button
              color="primary"
              icon={<PlusOutlined />}
              variant="solid"
              size="small"
              onClick={addFn}
            >
              新增
            </Button>
            {/* 归档 */}
            <Button
              color="primary"
              icon={<EditOutlined />}
              variant="solid"
              size="small"
            >
              编辑
            </Button>
            {/* 归档 */}
            <Button
              color="primary"
              icon={<HddTwoTone />}
              variant="outlined"
              size="small"
              onClick={archiveFn}
            >
              归档
            </Button>
            <Button
              variant="outlined"
              color="danger"
              icon={<DeleteTwoTone twoToneColor="red" />}
              size="small"
              onClick={deleteFn}
            >
              删除
            </Button>
          </Flex>
        </Flex>
      }
    >
      {messageContextHolder}
      <AddDirModal
        modalVisible={modalVisible}
        closeModal={() => setModalVisible(false)}
        isAdd={true}
        refreshDirList={getProjectList}
      ></AddDirModal>
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: '#ccc',
          },
        }}
      >
        <Table
          rowSelection={tableRowSelection}
          style={{ height: '100%', overflow: 'hidden' }}
          size="small"
          dataSource={dirList}
          rowKey="id"
          bordered
          pagination={false}
          scroll={{
            y: '100%',
          }}
        >
          {/* 序号 */}
          <Column
            align="center"
            width={40}
            title="No."
            render={(a, b, index) => <>{index + 1}</>}
          />
          {/* 项目名称 */}
          <Column
            title="目录名称"
            dataIndex="dirName"
            key="dirName"
            ellipsis={true}
          />
        </Table>
      </ConfigProvider>
    </Card>
  );
};
