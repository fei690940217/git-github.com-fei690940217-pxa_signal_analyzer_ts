/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 10:36:44
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\projectManage\subProjectList\index.tsx
 * @Description: 项目列表主表格
 */

import {
  Button,
  Table,
  message,
  Modal,
  Space,
  Flex,
  ConfigProvider,
  Card,
  Tooltip,
  TableProps,
} from 'antd';
import {
  SwapOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteTwoTone,
  FolderOpenTwoTone,
  FileWordTwoTone,
  HddTwoTone,
} from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import './index.scss';
import Moment from 'moment';
import { useTranslation } from 'react-i18next';
import { logError } from '@/utils/logLevel';
import { ProjectItemType, SubProjectItemType } from '@src/customTypes/renderer';
import { divide } from 'lodash';
import { useAppSelector } from '@src/renderer/hook';
import { AddDirType } from '@src/customTypes';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];
const { Column } = Table;
const { ipcRenderer } = window.myApi;
type PropsType = {
  currentDir: AddDirType | null;
};
export default ({ currentDir }: PropsType) => {
  const { t, i18n } = useTranslation('testPage');
  const [messageApi, messageContextHolder] = message.useMessage();
  const [subProjectList, setSubProjectList] = useState<ProjectItemType[]>([]);
  const [selectSubProject, setSelectSubProject] = useState<ProjectItemType[]>(
    [],
  );
  //获取测试列表
  const getSubProjectList = async () => {
    if (currentDir?.id) {
      const list = await ipcRenderer.invoke(
        'getSubProjectList',
        currentDir.dirName,
      );
      setSubProjectList(list);
    } else {
      setSubProjectList([]);
    }
  };
  useEffect(() => {
    getSubProjectList();
  }, [currentDir?.id]);

  //生成报告
  const generateReport = async (row: ProjectItemType) => {
    try {
      if (row?.id && currentDir?.dirName) {
        await ipcRenderer.invoke('generateDocx', {
          projectName: row.projectName,
          dirName: currentDir?.dirName,
        });
        messageApi.success('S U C C E S S');
      }
    } catch (error) {
      logError(String(error));
      messageApi.error(String(error));
    }
  };

  const generateReportColumnRender = (
    _text: any,
    record: ProjectItemType,
    _index: any,
  ) => {
    return (
      <Tooltip title="生成报告">
        <FileWordTwoTone onClick={() => generateReport(record)} />
      </Tooltip>
    );
  };
  const openDir = async (row: ProjectItemType) => {
    try {
      if (row?.projectName && currentDir?.dirName) {
        const res = await ipcRenderer.invoke('showItemInFolder', {
          projectName: row?.projectName,
          dirName: currentDir?.dirName,
        });
        console.log('showItemInFolder', res);
      }
    } catch (error) {
      logError(String(error));
      messageApi.error(String(error));
    }
  };
  const openDirColumnRender = (_text: any, record: ProjectItemType) => {
    return (
      <Tooltip title="打开文件夹">
        <FolderOpenTwoTone onClick={() => openDir(record)} />
      </Tooltip>
    );
  };
  const createTimeRender = (text: string) => {
    return Moment(text).format('YYYY-MM-DD HH:mm');
  };
  const addFn = () => {
    if (currentDir?.dirName) {
      ipcRenderer.send('openTheProjectWindow', {
        projectName: currentDir.dirName,
      });
    }
  };
  const editFn = () => {};
  const tableRowSelection: TableRowSelection<ProjectItemType> = {
    type: 'checkbox',
    hideSelectAll: true,
    columnTitle: '/',
    columnWidth: 30,
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows);
      setSelectSubProject(selectedRows);
    },
    selectedRowKeys: selectSubProject.map((item) => item.id),
  };
  return (
    <Card
      className="project-manage-card manage-card-item"
      styles={{
        header: { minHeight: 36, lineHeight: '36px', padding: '0 8px' },
        body: { padding: 8 },
      }}
      title={
        <Flex gap={20}>
          <h2 className="card-title-text">项目管理</h2>
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
              onClick={editFn}
            >
              编辑
            </Button>
            {/* 归档 */}
            <Button
              color="primary"
              icon={<HddTwoTone />}
              variant="outlined"
              onClick={editFn}
              size="small"
            >
              归档
            </Button>
            <Button
              variant="outlined"
              color="danger"
              icon={<DeleteTwoTone twoToneColor="red" />}
              size="small"
              onClick={editFn}
            >
              删除
            </Button>
          </Flex>
        </Flex>
      }
    >
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: '#ccc',
          },
        }}
      >
        <Table
          rowSelection={tableRowSelection}
          size="small"
          dataSource={subProjectList}
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
          {/* 结果result */}
          <Column
            title="项目名称"
            dataIndex="projectName"
            key="projectName"
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
            width={50}
            title="Docx"
            ellipsis={true}
            render={generateReportColumnRender}
          />
          {/* 操作 */}
          <Column
            align="center"
            width={50}
            title="Dir"
            ellipsis={true}
            render={openDirColumnRender}
          />
        </Table>
      </ConfigProvider>
    </Card>
  );
};
