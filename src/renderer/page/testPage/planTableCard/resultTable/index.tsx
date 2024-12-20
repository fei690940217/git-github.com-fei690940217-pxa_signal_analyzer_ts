/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\planTableCard\resultTable\index.tsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 11:45:20
 * @Descripttion:
 */
import { Image, message, ConfigProvider, Table, notification } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';

import { useState, useEffect, useMemo, memo } from 'react';
import { type Key } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import './index.scss';
import ColumnsHandle from './column';
import addLog from '@/store/asyncThunk/addLog';
import { logError } from '@/utils/logLevel';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';
import { ResultItemType, TestItemType } from '@src/customTypes/renderer';
type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];
const { appConfigFilePath, ipcRenderer } = window.myApi;

type Props = {
  selectedListItem: Key[];
  setSelectedListItem: (val: Key[]) => void;
  currentResult: ResultItemType[];
  refreshCurrentResult: () => void;
};
const App = ({
  selectedListItem,
  setSelectedListItem,
  currentResult,
  refreshCurrentResult,
}: Props) => {
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const currentRow = useAppSelector((state) => state.projectList.currentRow);
  //请前测试记录文件夹名称
  const currentTestRecordName = useAppSelector(
    (state) => state.testStatus.currentTestRecordName,
  );
  //展示截图使用
  const [visible, setVisible] = useState(false);
  const [imgSrc, setImgSrc] = useState('');

  //测试用例
  const testItem = currentResult[0]?.testItem || '';
  //展示截图
  const showScreenCapture = async (id: number) => {
    try {
      const imageUrl = await ipcRenderer.invoke('getImageBase4', {
        projectName: currentRow?.projectName,
        subProjectName: currentTestRecordName,
        id,
      });
      setImgSrc(imageUrl);
      setVisible(true);
    } catch (error) {
      logError(error?.toString());
      messageApi.error('无法预览,请检查图片是否存在');
    }
  };
  //删除某一条的结果
  const deleteResult = async (row: ResultItemType) => {
    try {
      const resultFilePath = `${appConfigFilePath}/user/project/${currentRow?.projectName}/${currentTestRecordName}/result.json`;
      await ipcRenderer.invoke('deleteResult', {
        resultFilePath,
        row,
      });
      messageApi.success('已删除');
      //添加log
      const log = `warning_-_id为${row.id}的测试条目,结果已删除`;
      dispatch(addLog(log));
      refreshCurrentResult();
    } catch (error) {
      logError(error?.toString());
      notification.error({
        message: 'Error',
        description: error?.toString(),
      });
    }
  };
  const columns = ColumnsHandle(testItem, showScreenCapture, deleteResult);

  const tableRowSelection: TableRowSelection<ResultItemType> = {
    type: 'radio',
    selectedRowKeys: selectedListItem,
    onChange: (selectedRowKeys: Key[]) => {
      if (currentTestRecordName) {
        setSelectedListItem(selectedRowKeys);
      }
    },
  };
  return (
    <div className="all-result-table-wrapper">
      {contextHolder}
      <div className="all-result-table-content">
        <ConfigProvider
          theme={{
            token: {
              colorBorderSecondary: '#ccc',
            },
          }}
        >
          <Table
            rowSelection={tableRowSelection}
            bordered
            style={{ height: '100%', width: '100%', overflow: 'hidden' }}
            size="small"
            dataSource={currentResult}
            rowKey="id"
            pagination={false}
            scroll={{ y: '' }}
            columns={columns}
          ></Table>
        </ConfigProvider>
      </div>
      {/* 截图预览 */}
      <Image
        style={{
          display: 'none',
        }}
        preview={{
          visible,
          src: imgSrc,
          onVisibleChange: (value) => {
            setVisible(value);
          },
        }}
      />
    </div>
  );
};
export default App;
