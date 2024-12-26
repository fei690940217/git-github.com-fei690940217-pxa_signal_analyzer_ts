/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-26 10:09:48
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\projectListPage\index.tsx
 * @Description: 项目列表主表格
 */

import { Table, ConfigProvider, Card, message } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import React, { useState, useEffect } from 'react';
import './index.scss';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';

import { setProjectList } from '@/store/modules/projectList';
import setCurrentRow from '@src/renderer/store/asyncThunk/setCurrentRow';

import CardExtra from './cardExtra';
import { useTranslation } from 'react-i18next';
import { logError } from '@/utils/logLevel';
import { useLocation } from 'react-router';
import { electronStoreGetAsync } from '@src/renderer/utils/electronStore';
import { ProjectItemType } from '@src/customTypes/renderer';
type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];
const { ipcRenderer } = window.myApi;
const { Column } = Table;
export default () => {
  const { t, i18n } = useTranslation('testPage');
  const currentRow = useAppSelector((state) => state.projectList.currentRow);
  const location = useLocation();

  const [messageApi, messageContextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  //redux- projectList
  // const currentRow = useSelector((state) => state.projectList.currentRow);
  const projectList = useAppSelector((state) => state.projectList.projectList);
  //是否正在测试
  const isInProgress = useAppSelector((state) => state.testStatus.isInProgress);
  const [bodyWidth, setBodyWidth] = useState(360);
  const getProjectList = async () => {
    try {
      const list = await ipcRenderer.invoke('getJsonFile', {
        type: 'projectList',
      });
      dispatch(setProjectList(list));
    } catch (error) {
      logError(`获取项目列表失败: ${error?.toString()}`);
      dispatch(setProjectList([]));
    }
  };
  const init_fn = async () => {
    try {
      //获取项目列表
      const list: ProjectItemType[] = await ipcRenderer.invoke('getJsonFile', {
        type: 'projectList',
      });
      dispatch(setProjectList(list));
      let findProjectId = '';
      const { form, projectId } = location.state || {};
      //如果是从新增或编辑页面跳转过来，则命中该项
      if (form === 'addPage' && projectId) {
        findProjectId = projectId;
      }
      //如果不是新增页面过来
      else {
        const localCurrentRow = await electronStoreGetAsync('currentRow');
        findProjectId = localCurrentRow?.id;
      }
      const findItem = list.find((item) => item.id === findProjectId);
      if (findItem) {
        dispatch(setCurrentRow(findItem));
      } else {
        dispatch(setCurrentRow(null));
      }
    } catch (error) {
      console.log(error);
    }
  };
  //初始化操作
  useEffect(() => {
    init_fn();
  }, []);
  const tableRowSelection: TableRowSelection<ProjectItemType> = {
    type: 'checkbox',
    hideSelectAll: true,
    columnTitle: '/',
    columnWidth: 30,
    onChange: (selectedRowKeys, selectedRows) => {
      if (selectedRowKeys.length) {
        let len = selectedRowKeys.length - 1;
        dispatch(setCurrentRow(selectedRows[len]));
      } else {
        dispatch(setCurrentRow(null));
      }
    },
    //默认选中项的数组列表
    // defaultSelectedRowKeys,
    selectedRowKeys: [currentRow?.id || ''],
    getCheckboxProps: () => ({
      //如果进行中禁止修改选中行
      disabled: isInProgress,
    }),
  };
  const collapseFn = () => {
    setBodyWidth(bodyWidth === 360 ? 180 : 360);
  };
  return (
    <Card
      className="project-list-card"
      styles={{
        header: { minHeight: 36, lineHeight: '36px', padding: '0 12px' },
        body: { padding: '12px 0' },
      }}
      style={{ width: bodyWidth }}
      title={t('projectList')}
      extra={
        <CardExtra
          collapseFn={collapseFn}
          getProjectList={getProjectList}
          currentRow={currentRow}
        />
      }
    >
      {messageContextHolder}
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: '#ccc',
          },
        }}
      >
        <Table
          className="project-list-table"
          rowSelection={tableRowSelection}
          style={{ height: '100%', overflow: 'hidden' }}
          size="small"
          dataSource={projectList}
          rowKey={(row) => row.id}
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
            title={t('projectName')}
            dataIndex="projectName"
            key="projectName"
            ellipsis={true}
          />
        </Table>
      </ConfigProvider>
    </Card>
  );
};
