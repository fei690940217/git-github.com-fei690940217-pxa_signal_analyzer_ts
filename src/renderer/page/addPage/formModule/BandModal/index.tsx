/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:45:03
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\index.tsx
 * @Description: 项目列表主表格
 */

import { Table, message, Modal, Button, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState, useEffect, useMemo } from 'react';
import './index.scss';
import { cloneDeep } from 'lodash';
import { logError } from '@/utils/logLevel';
import { BandItemInfo } from '@src/customTypes/renderer';
import { nanoid } from 'nanoid';
import NRBand from './cmp/NRBand';
import LTEBand from './cmp/LTEBand';
import SCSColumn from './cmp/SCSColumn';
import NRBWColumn from './cmp/NRBWColumn';
import { setSelectBand } from '@src/renderer/store/modules/projectList';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';
const { ipcRenderer } = window.myApi;

type PropsType = {
  modalVisible: boolean;
  closeModal: () => void;
  showLTE: boolean;
  LTEBandList: any;
};
export default ({
  modalVisible,
  closeModal,
  showLTE,
  LTEBandList,
}: PropsType) => {
  //本弹窗内的选择项
  const [FCCBandList, setFCCBandList] = useState<BandItemInfo[]>([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const selectBand = useAppSelector((state) => state.projectList.selectBand);
  const dispatch = useAppDispatch();
  //获取FCC Band列表
  const getBandList = async () => {
    try {
      const allBandList = await ipcRenderer.invoke(
        'getJsonFileByFilePath',
        'app/authTypeObj.json',
      );
      setFCCBandList(allBandList['FCC']);
    } catch (error) {
      console.error(error);
      setFCCBandList([]);
    }
  };
  useEffect(() => {
    getBandList();
  }, []);
  const bandObj = useMemo(() => {
    try {
      if (FCCBandList?.length) {
        const FDD_LIST: BandItemInfo[] = [];
        const TDD_LIST: BandItemInfo[] = [];
        //先找出FDD
        FCCBandList.forEach((item) => {
          const { duplexMode } = item;
          if (duplexMode === 'FDD') {
            FDD_LIST.push(item);
          } else {
            TDD_LIST.push(item);
          }
        });
        return { FDD: FDD_LIST, TDD: TDD_LIST };
      } else {
        return { FDD: [], TDD: [] };
      }
    } catch (error) {
      return { FDD: [], TDD: [] };
    }
  }, [FCCBandList]);

  useEffect(() => {
    if (modalVisible) {
    }
  }, [modalVisible]);
  const formVerify = async () => {
    try {
      if (selectBand?.length) {
        //NSA
        for (let BandObj of selectBand) {
          const { Band, SCS, BW, ARFCN } = BandObj;
          //SA
          if (!SCS?.length) {
            return Promise.reject(`${Band}未选择SCS`);
          }
          if (!BW?.length) {
            return Promise.reject(`${Band}未选择BW`);
          }
          if (!ARFCN?.length) {
            return Promise.reject(`${Band}未选择ARFCN`);
          }
        }
        return Promise.resolve();
      } else {
        return Promise.reject('未选择NR_Band');
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const submit = async () => {
    try {
      await formVerify();
      closeModal();
    } catch (error) {
      logError(error?.toString());
      messageApi.error(error?.toString());
    }
  };

  //添加一行
  const addRow = () => {
    const row: BandItemInfo = {
      id: nanoid(8),
      Band: '',
      FL: 0,
      FH: 0,
      CSE_Limit: null,
      duplexMode: 'TDD', // 假设duplexMode只能是TDD或FDD
      LTE_Band: [], // 空数组，但类型为number[]
      SCS: [], // 已知SCS是一个包含数字的数组
      BW: [], // 已知BW是一个包含数字的数组
      ARFCN: [], // 已知ARFCN是一个包含数字的数组
    };
    const tempSelectBand = cloneDeep(selectBand);
    dispatch(setSelectBand([...tempSelectBand, row]));
  };
  const DelColumnRender = () => {
    return <DeleteOutlined style={{ color: 'red', cursor: 'print' }} />;
  };
  const columns: TableProps<BandItemInfo>['columns'] = [
    {
      title: 'No.',
      width: 40,
      align: 'center',
      render: (text, record, index) => index + 1,
    },
    {
      title: 'NR_Band',
      dataIndex: 'Band',
      key: 'Band',
      width: 120,
      render: (text, record) => (
        <NRBand row={record} bandObj={bandObj}></NRBand>
      ),
    },
    {
      title: 'LTE_Band',
      dataIndex: 'LTE_Band',
      key: 'LTE_Band',
      width: 230,
      hidden: !showLTE,
      render: (text, record) => (
        <LTEBand row={record} LTEBandList={LTEBandList}></LTEBand>
      ),
    },
    {
      title: 'SCS',
      dataIndex: 'SCS',
      key: 'SCS',
      width: 160,
      ellipsis: true,
      render: (text, record) => <SCSColumn row={record}></SCSColumn>,
    },
    {
      title: 'NR_BW(MHz)',
      dataIndex: 'BW',
      key: 'BW',
      width: 230,
      ellipsis: true,
      render: (text, record) => <NRBWColumn row={record}></NRBWColumn>,
    },
    {
      title: 'NR_ARFCN',
      dataIndex: 'ARFCN',
      key: 'ARFCN',
      width: 220,
      ellipsis: true,
      render: (text, record) => <NRBWColumn row={record}></NRBWColumn>,
    },
    {
      title: 'Del',
      width: 40,
      align: 'center',
      render: DelColumnRender,
    },
  ];
  return (
    <Modal
      keyboard={false}
      maskClosable={false}
      title="NR-Band"
      open={modalVisible}
      onCancel={closeModal}
      style={{ maxHeight: '90vh' }}
      centered={true}
      wrapClassName="select-band-modal-wrapper"
      onOk={submit}
      width={1200}
    >
      {messageContextHolder}
      <div className="select-band-modal-content">
        {/* 已选区域 */}
        <div
          style={{ marginBottom: 30 }}
          className="select-band-modal-content-top"
        >
          <Table
            size="small"
            dataSource={selectBand}
            rowKey="id"
            bordered
            pagination={false}
            columns={columns}
          />
          <div style={{ marginTop: 10 }}>
            <Tooltip title="添加一行">
              <Button
                onClick={addRow}
                color="primary"
                variant="dashed"
                icon={<PlusOutlined />}
              ></Button>
            </Tooltip>
          </div>
        </div>
      </div>
    </Modal>
  );
};
