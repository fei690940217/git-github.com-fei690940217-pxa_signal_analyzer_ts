/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-30 16:54:14
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
import ARFCNColumn from './cmp/ARFCNColumn';
import { setAddFormValue } from '@src/renderer/store/modules/projectList';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';
import { NRBandObjType, BandItemType } from '@src/customTypes/main';
const { ipcRenderer } = window.myApi;

type PropsType = {
  showLTE: boolean;
  LTEBandList: any;
};
export default ({ showLTE, LTEBandList }: PropsType) => {
  //本弹窗内的选择项
  const [FCCBandList, setFCCBandList] = useState<BandItemType[]>([]);
  const [messageApi, messageContextHolder] = message.useMessage();
  const addFormValue = useAppSelector((state) => state.addFormValue);
  const { selectBand } = addFormValue;
  const dispatch = useAppDispatch();
  //获取FCC Band列表
  const getBandList = async () => {
    try {
      const allBandList: NRBandObjType = await ipcRenderer.invoke(
        'getJsonFileByFilePath',
        'app/NR_Band_List.json',
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
        const FDD_LIST: BandItemType[] = [];
        const TDD_LIST: BandItemType[] = [];
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
    tempSelectBand.push(row);
    dispatch(setAddFormValue({ ...addFormValue, selectBand: tempSelectBand }));
  };
  //删除一行
  const delRow = (row: BandItemInfo) => {
    const tempSelectBand = cloneDeep(selectBand);
    const rst = tempSelectBand.filter((item) => item.id !== row.id);
    dispatch(setAddFormValue({ ...addFormValue, selectBand: rst }));
  };
  const DelColumnRender = (_text: any, row: BandItemInfo) => {
    return (
      <DeleteOutlined
        onClick={() => delRow(row)}
        style={{ color: 'red', cursor: 'print' }}
      />
    );
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
      width: 140,
      render: (text, record) => <NRBand row={record} bandObj={bandObj} />,
    },
    {
      title: 'LTE_Band',
      dataIndex: 'LTE_Band',
      key: 'LTE_Band',
      width: 230,
      hidden: !showLTE,
      render: (text, record) => (
        <LTEBand row={record} LTEBandList={LTEBandList} />
      ),
    },
    {
      title: 'SCS(KHz)',
      dataIndex: 'SCS',
      key: 'SCS',
      width: 180,
      ellipsis: true,
      render: (text, record) => <SCSColumn row={record} />,
    },
    {
      title: 'NR_BW(MHz)',
      dataIndex: 'BW',
      key: 'BW',
      width: 230,
      ellipsis: true,
      render: (text, record) => <NRBWColumn row={record} />,
    },
    {
      title: 'NR_ARFCN',
      dataIndex: 'ARFCN',
      key: 'ARFCN',
      width: 180,
      ellipsis: true,
      render: (text, record) => <ARFCNColumn row={record} />,
    },
    {
      title: 'Del',
      width: 40,
      align: 'center',
      render: DelColumnRender,
    },
  ];
  return (
    <div className="select-band-modal-content">
      {messageContextHolder}
      <div
        style={{ marginTop: 10 }}
        className="select-band-modal-content__left"
      >
        <Tooltip title="添加一行">
          <Button
            onClick={addRow}
            color="primary"
            variant="dashed"
            icon={<PlusOutlined />}
          ></Button>
        </Tooltip>
      </div>
      {/* 已选区域 */}
      <div className="select-band-modal-content__right">
        <Table
          size="small"
          dataSource={selectBand}
          rowKey="id"
          bordered
          pagination={false}
          columns={columns}
        />
      </div>
    </div>
  );
};
