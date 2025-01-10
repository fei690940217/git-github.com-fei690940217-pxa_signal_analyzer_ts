/*
 * @Author: feifei
 * @Date: 2023-07-11 15:42:24
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 10:41:05
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\projectManage\subProjectList\detailModal.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Descriptions, Modal, Table } from 'antd';
import type { FC } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import {
  ProjectItemType,
  SubProjectItemType,
  BandItemInfo,
  RBItemType,
} from '@src/customTypes/renderer';

const { Column } = Table;
type BandTablePropsType = {
  selectBand: BandItemInfo[];
};
const BandTable: FC<BandTablePropsType> = ({ selectBand }) => {
  return (
    <Table size="small" dataSource={selectBand} rowKey="id" pagination={false}>
      {/* 序号 */}
      <Column
        align="center"
        width={40}
        title="No."
        render={(a, b, index) => <>{index + 1}</>}
      />
      {/* 项目名称 */}
      <Column title="NR_Band" width={60} dataIndex="Band" ellipsis={true} />
      {/* LTE_Band */}
      <Column
        align="center"
        title="LTE_Band"
        dataIndex="LTE_Band"
        width={60}
        render={(text) => text?.join(',')}
      />
      {/* SCS(KHz) */}
      <Column
        align="center"
        title="SCS(KHz)"
        dataIndex="SCS"
        width={60}
        render={(text) => text?.join(',')}
      />
      {/* BW */}
      <Column
        align="center"
        title="NR_BW(MHz)"
        dataIndex="BW"
        width={60}
        render={(text) => text?.join(',')}
      />
      {/* NR_ARFCN */}
      <Column
        align="center"
        title="NR_ARFCN"
        dataIndex="ARFCN"
        width={60}
        render={(text) => text?.join(',')}
      />
    </Table>
  );
};
type RBSelectedPropsType = {
  RBConfigSelected: RBItemType[];
  testItem: string;
};
const RBSelectedTable: FC<RBSelectedPropsType> = ({
  RBConfigSelected,
  testItem,
}) => {
  const isHiddenChannel = testItem !== 'BandEdge';
  return (
    <Table
      size="small"
      dataSource={RBConfigSelected}
      rowKey="id"
      pagination={false}
    >
      {/* 序号 */}
      <Column
        align="center"
        width={40}
        title="No."
        render={(a, b, index) => <>{index + 1}</>}
      />
      {/* 调制 */}
      <Column
        width={70}
        title="Channel"
        dataIndex="level"
        render={(text) => (text === 'H' ? 'High' : 'Low')}
        hidden={isHiddenChannel}
      />
      {/* 调制 */}
      <Column
        width={160}
        title="OFDM"
        dataIndex="OFDM"
        key="OFDM"
        ellipsis={true}
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
  );
};
type ModalContentPropsType = {
  record: ProjectItemType;
};
const ModalContent: FC<ModalContentPropsType> = ({ record }) => {
  const {
    projectName,
    testItems,
    isGate,
    networkMode,
    selectBand,
    LTE_BW,
    LTE_ARFCN,
    RBConfigSelected,
  } = record;
  return (
    <div>
      <Descriptions title="项目详情" bordered column={2} size="small">
        <Descriptions.Item label="项目名称">{projectName}</Descriptions.Item>
        <Descriptions.Item label="testItems">{testItems}</Descriptions.Item>
        <Descriptions.Item label="isGate">
          {isGate ? 'Yes' : 'No'}
        </Descriptions.Item>
        <Descriptions.Item label="networkMode">{networkMode}</Descriptions.Item>
        <Descriptions.Item label="LTE_BW">{LTE_BW}</Descriptions.Item>
        <Descriptions.Item label="LTE_ARFCN">{LTE_ARFCN}</Descriptions.Item>
        <Descriptions.Item label="Band" span={2}>
          <BandTable selectBand={selectBand} />
        </Descriptions.Item>
        <Descriptions.Item label="RBConfig" span={2}>
          <RBSelectedTable
            RBConfigSelected={RBConfigSelected}
            testItem={testItems}
          />
        </Descriptions.Item>
      </Descriptions>
      ;
    </div>
  );
};
export default (record: ProjectItemType) => {
  Modal.info({
    title: null,
    icon: null,
    content: <ModalContent record={record} />,
    footer: null,
    centered: true,
    width: 900,
    closable: true,
  });
};
