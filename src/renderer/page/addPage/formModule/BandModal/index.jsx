/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 14:56:52
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\formModule\BandModal\index.jsx
 * @Description: 项目列表主表格
 */

import { Table, message, Modal, Checkbox, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useMemo, lazy } from 'react';
import './index.scss';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { cloneDeep } from 'lodash';
import { NR_BW_LIST } from '../handle/formData';
import LTEBandModal from './LTEBandModal';
import { logInfo, logError } from '@/utils/logLevel.js';

const { Column } = Table;
const { ipcRenderer } = window.myApi;

//判断是不是纯对象
const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};
//

export default ({
  modalVisible,
  closeModal,
  selectBand,
  setSelectBand,
  showLTE,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //本弹窗内的选择项
  const [modalSelectBand, setModalSelectBand] = useState([]);
  const [FCCBandList, setFCCBandList] = useState([]);
  const [LTEBandModalVisible, setLTEBandModalVisible] = useState(false);
  const [currentNRBand, setCurrentNRBand] = useState({});
  const [messageApi, messageContextHolder] = message.useMessage();
  const getBandList = async () => {
    const allBandList = await ipcRenderer.invoke(
      'getJsonFileByFilePath',
      'app/authTypeObj.json',
    );
    setFCCBandList(allBandList['FCC']);
  };
  useEffect(() => {
    getBandList();
  }, []);
  const bandObj = useMemo(() => {
    try {
      if (FCCBandList?.length) {
        //先找出FDD
        const FDD_LIST = FCCBandList?.filter(({ duplexMode }) => {
          return duplexMode === 'FDD';
        });
        //先找出TDD
        const TDD_LIST = FCCBandList?.filter(({ duplexMode }) => {
          return duplexMode === 'TDD';
        });
        return { FDD: FDD_LIST, TDD: TDD_LIST };
      } else {
      }
    } catch (error) {
      logError(error.toString());
      return [];
    }
  }, [FCCBandList]);

  const selectBandList = useMemo(() => {
    if (modalSelectBand?.length) {
      const isObj = isObject(modalSelectBand[0]);
      if (isObj) {
        return modalSelectBand.map((item) => item.Band);
      } else {
        return modalSelectBand;
      }
    } else {
      return [];
    }
  }, [modalSelectBand]);
  //弹窗打开事件
  const dialogOpen = () => {
    setModalSelectBand(cloneDeep(selectBand));
  };
  useEffect(() => {
    if (modalVisible) {
      dialogOpen();
    }
  }, [modalVisible]);

  const onSelectBandChange = (e) => {
    const { value, checked } = e.target;
    //选中
    if (checked) {
      const findItem = FCCBandList.find((item) => {
        return value === item.Band;
      });
      if (findItem) {
        const tempList = cloneDeep(modalSelectBand);
        tempList.push({
          ...findItem,
          SCS: [],
          BW: [],
          ARFCN: [],
        });
        //band排序
        tempList.sort((a, b) => {
          const numA = parseInt(a.Band.match(/\d+/)[0]);
          const numB = parseInt(b.Band.match(/\d+/)[0]);
          return numA - numB;
        });
        setModalSelectBand(tempList);
      }
    }
    //删掉
    else {
      const tempList = modalSelectBand?.filter((item) => {
        return item.Band !== value;
      });
      setModalSelectBand(tempList);
    }
  };
  const formVerify = async () => {
    try {
      if (modalSelectBand?.length) {
        //NSA
        for (let BandObj of modalSelectBand) {
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
      setSelectBand(modalSelectBand);
      closeModal();
    } catch (error) {
      logError(error.toString());
      messageApi.error(error);
    }
  };
  const BW_Change = (value, record) => {
    value.sort((a, b) => a - b);
    const { Band } = record;
    const tempList = modalSelectBand.map((item) => {
      if (item.Band === Band) {
        item.BW = value;
      }
      return item;
    });
    setModalSelectBand(tempList);
  };
  const NR_BWColumnRender = (text, record, index) => {
    return (
      <Select
        size="small"
        onChange={(value) => BW_Change(value, record)}
        value={record.BW}
        style={{
          width: '100%',
        }}
        mode="multiple"
        allowClear
        placeholder="Select NR_BW"
        options={NR_BW_LIST}
      />
    );
  };
  const SCS_Change = (value, record) => {
    value.sort((a, b) => a - b);
    const { Band } = record;
    const tempList = modalSelectBand.map((item) => {
      if (item.Band === Band) {
        item.SCS = value;
      }
      return item;
    });
    setModalSelectBand(tempList);
  };
  const SCSColumnRender = (text, record, index) => {
    return (
      <Select
        size="small"
        onChange={(value) => SCS_Change(value, record)}
        value={record.SCS}
        filterOption={false}
        mode="multiple"
        placeholder="Select SCS"
        style={{
          width: '100%',
        }}
        options={[
          {
            value: 15,
            label: '15KHz',
          },
          {
            value: 30,
            label: '30KHz',
          },
          {
            value: 60,
            label: '60KHz',
          },
        ]}
      />
    );
  };
  const ARFCN_Change = (value, record) => {
    //排序
    value.sort((a, b) => a - b);
    const { Band } = record;
    const tempList = modalSelectBand.map((item) => {
      if (item.Band === Band) {
        item.ARFCN = value;
      }
      return item;
    });
    setModalSelectBand(tempList);
  };
  //ARFCN
  const ARFCNColumnRender = (text, record, index) => {
    return (
      <Select
        size="small"
        onChange={(value) => ARFCN_Change(value, record)}
        value={record.ARFCN}
        filterOption={false}
        mode="multiple"
        placeholder="Select ARFCN"
        style={{
          width: '100%',
        }}
        options={[
          {
            value: 0,
            label: 'Low',
          },
          {
            value: 1,
            label: 'Mid',
          },
          {
            value: 2,
            label: 'High',
          },
        ]}
      />
    );
  };
  const addLTEBand = (row) => {
    setCurrentNRBand(row);
    setLTEBandModalVisible(true);
  };
  const LTE_BandColumnRender = (text, record, index) => {
    let bandList = [];
    if (record?.LTE_Band?.length) {
      bandList = record.LTE_Band;
    }
    return (
      <div className="lte-band-column-wrapper">
        {/* left */}
        <div className="lte-band-column-left">{bandList.join(' , ')}</div>
        <div className="lte-band-column-right">
          <EditOutlined
            style={{ color: '#36c', cursor: 'pointer' }}
            onClick={() => addLTEBand(record)}
          />
        </div>
      </div>
    );
  };
  //刷新LTE_Band
  const refreshLTEBand = (LTE_Band) => {
    const tempModalSelectBand = cloneDeep(modalSelectBand);
    const list = tempModalSelectBand.map((item) => {
      if (item.Band === currentNRBand.Band) {
        item.LTE_Band = LTE_Band;
      }
      return item;
    });
    setModalSelectBand(list);
  };
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
      <LTEBandModal
        modalVisible={LTEBandModalVisible}
        closeModal={() => setLTEBandModalVisible(false)}
        currentNRBand={currentNRBand}
        refreshLTEBand={refreshLTEBand}
      ></LTEBandModal>
      <div className="select-band-modal-content">
        {/* 已选区域 */}
        <div
          style={{ marginBottom: 30 }}
          className="select-band-modal-content-top"
        >
          <Table
            size="small"
            dataSource={modalSelectBand}
            rowKey="Band"
            bordered
            pagination={false}
          >
            {/* 序号 */}
            <Column
              align="center"
              width={40}
              title="No."
              render={(a, b, index) => <>{index + 1}</>}
            />
            {/* NR-Band */}
            <Column
              width={140}
              title="NR_Band"
              dataIndex="Band"
              key="Band"
              ellipsis={true}
            />
            {/* LTE-Band */}
            {showLTE && (
              <Column
                width={230}
                title="LTE_Band"
                dataIndex="LTE_Band"
                ellipsis={true}
                render={LTE_BandColumnRender}
              />
            )}
            {/* SCS */}
            <Column
              width={160}
              title="SCS"
              dataIndex="SCS"
              key="SCS"
              ellipsis={true}
              render={SCSColumnRender}
            />
            {/* BW */}
            <Column
              width={230}
              title="NR_BW(MHz)"
              dataIndex="BW"
              key="BW"
              ellipsis={true}
              render={NR_BWColumnRender}
            />
            {/* BW */}
            <Column
              width={220}
              title="NR_ARFCN"
              dataIndex="ARFCN"
              key="ARFCN"
              ellipsis={true}
              render={ARFCNColumnRender}
            />
          </Table>
        </div>
        {/* 待选区域 */}
        <div className="select-band-modal-content-bottom">
          <Checkbox.Group value={selectBandList}>
            <div className="select-band-checkbox">
              <div style={{ display: 'flex', marginBottom: 18 }}>
                <div style={{ fontWeight: 600, margin: '10px 0', width: 50 }}>
                  FDD
                </div>
                <div className="band-checkbox-wrapper" style={{ flex: 1 }}>
                  {bandObj?.FDD?.map((BandObj) => {
                    const { Band } = BandObj;
                    return (
                      <div key={Band} className="select-band-checkbox-item">
                        <Checkbox value={Band} onChange={onSelectBandChange}>
                          {Band}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: 18 }}>
                <div style={{ fontWeight: 600, margin: '10px 0', width: 50 }}>
                  TDD
                </div>
                <div className="band-checkbox-wrapper" style={{ flex: 1 }}>
                  {bandObj?.TDD?.map((BandObj) => {
                    const { Band } = BandObj;
                    return (
                      <div key={Band} className="select-band-checkbox-item">
                        <Checkbox value={Band} onChange={onSelectBandChange}>
                          {Band}
                        </Checkbox>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Checkbox.Group>
        </div>
      </div>
    </Modal>
  );
};
