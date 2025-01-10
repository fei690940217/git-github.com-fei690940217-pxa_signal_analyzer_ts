/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-30 14:47:07
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\RBPlanTable\index.tsx
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

import React from 'react';
import './index.scss';
import { Table, ConfigProvider } from 'antd';
import RBTableObj from '@/page/addPage/util/RBTableObj';
import type { TableProps } from 'antd';
import type { RBItemType } from '@src/customTypes/renderer';
import { setAddFormValue } from '@src/renderer/store/modules/projectList';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';

type TableRowSelection<T extends object = object> =
  TableProps<T>['rowSelection'];
const { Column } = Table;
//props testItem 测试用例
export default () => {
  const dispatch = useAppDispatch();
  const addFormValue = useAppSelector((state) => state.addFormValue);
  const testItem = addFormValue?.testItems || '';
  const RBTableList = RBTableObj[testItem];
  const isHiddenChannel = testItem !== 'BandEdge';
  const tableRowSelection: TableRowSelection<RBItemType> = {
    type: 'checkbox',
    checkStrictly: false,
    selectedRowKeys: addFormValue?.RBConfigSelected || [],
    onChange: (selectedRowKeys: React.Key[]) => {
      dispatch(
        setAddFormValue({ ...addFormValue, RBConfigSelected: selectedRowKeys }),
      );
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
