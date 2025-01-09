/*
 * @Author: feifei
 * @Date: 2023-07-11 15:42:24
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 17:15:10
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\projectManage\subProjectList\detailModal.tsx
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
import { Descriptions, Modal } from 'antd';
import type { FC } from 'react';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { ProjectItemType, SubProjectItemType } from '@src/customTypes/renderer';
type PropsType = {
  record: ProjectItemType;
};
const ModalContent: FC<PropsType> = ({ record }) => {
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
        <Descriptions.Item label="isGate">{isGate}</Descriptions.Item>
        <Descriptions.Item label="networkMode">{networkMode}</Descriptions.Item>
        <Descriptions.Item label="Band">
          No. 18, Wantang Road, Xihu District, Hangzhou, Zhejiang, China
        </Descriptions.Item>
        <Descriptions.Item label="LTE_BW">{LTE_BW}</Descriptions.Item>
        <Descriptions.Item label="LTE_ARFCN">{LTE_ARFCN}</Descriptions.Item>
        <Descriptions.Item label="RBConfig">
          {RBConfigSelected?.join(',')}
        </Descriptions.Item>
      </Descriptions>
      ;
    </div>
  );
};
export default (record: ProjectItemType) => {
  return new Promise<void>((resolve, reject) => {
    Modal.info({
      title: null,
      icon: null,
      content: <ModalContent record={record} />,
      footer: null,
      centered: true,
      width: 900,
      closable: true,
    });
  });
};
