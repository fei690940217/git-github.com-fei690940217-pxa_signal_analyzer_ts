/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 10:11:30
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\formModule\RBPlanTable\index.tsx
 * @Description: 勾选测试项页面
 */

/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 09:09:44
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\RBPlanTable\RBTableItem\index.tsx
 * @Description: 勾选测试项页面
 */

import React, { useEffect, useState } from 'react';
import './index.scss';
import { Table, ConfigProvider } from 'antd';
import type { TableProps } from 'antd';
import type { RBItemType, RBObjType } from '@src/customTypes/renderer';

import { setAddFormValue } from '@src/renderer1/store';
import { useAppSelector, useAppDispatch } from '@src/renderer1/hook';
const { ipcRenderer } = window.myApi;
type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];
const { Column } = Table;
//props testItem 测试用例
type PropsType = {
  id?: string;
  value?: RBItemType[];
  onChange?: (value: RBItemType[]) => void;
  RBTableList: RBItemType[];
};

export default (props: PropsType) => {
  const { id, value, onChange, RBTableList } = props;
  const dispatch = useAppDispatch();
  const addFormValue = useAppSelector((state) => state.addFormValue);
  const testItem = addFormValue?.testItems || '';
  const isHiddenChannel = testItem !== 'BandEdge';

  const selectedRowKeys = value?.map((item) => item.id) || [];

  const tableRowSelection: TableRowSelection<RBItemType> = {
    type: 'checkbox',
    checkStrictly: false,
    selectedRowKeys: selectedRowKeys,
    onChange: (selectedRowKeys: React.Key[], selectedRows: RBItemType[]) => {
      dispatch(
        setAddFormValue({ ...addFormValue, RBConfigSelected: selectedRows }),
      );
      onChange?.(selectedRows);
    },
  };
  //OFDM列自定义渲染
  const OFDMColumnRender = (text: string) => {
    if (text) {
      const OFDM = text === 'DFT' ? 'DFT-s-OFDM' : 'CP-OFDM';
      return OFDM;
    } else {
      return '';
    }
  };
  const ChannelColumnRender = (text: string) => {
    if (text) {
      const Channel = text === 'H' ? 'High' : 'Low';
      return Channel;
    } else {
      return '';
    }
  };
  return (
    <div className="add-project-sub-test-plan-wrapper">
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: '#ccc',
          },
        }}
      >
        <Table
          style={{ height: '100%', overflow: 'hidden' }}
          rowSelection={tableRowSelection}
          size="small"
          dataSource={RBTableList}
          bordered={true}
          rowKey="id"
          pagination={false}
        >
          {/* 序号 */}
          <Column
            align="center"
            title="No."
            width={60}
            render={(text, record, index) => index + 1}
          />
          {/* 调制 */}
          <Column
            width={70}
            title="Channel"
            dataIndex="level"
            render={ChannelColumnRender}
            hidden={isHiddenChannel}
          />
          {/* 调制 */}
          <Column
            width={160}
            title="OFDM"
            dataIndex="OFDM"
            key="OFDM"
            ellipsis={true}
            render={OFDMColumnRender}
          />
          {/* 调制 */}
          <Column
            width={120}
            title="Modulation"
            dataIndex="modulate"
            key="modulate"
            ellipsis={true}
          />
          {/* RB */}
          <Column title="RB" dataIndex="RB" key="RB" ellipsis={true} />
        </Table>
      </ConfigProvider>
    </div>
  );
};
