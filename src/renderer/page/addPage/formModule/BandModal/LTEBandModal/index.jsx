/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-06 14:32:29
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\formModule\BandModal\LTEBandModal\index.jsx
 * @Description: 项目列表主表格
 */

import { Modal, Radio, Checkbox } from "antd";

import React, { useState, useEffect, useMemo, lazy } from "react";
import "./index.scss";
const { ipcRenderer } = window.myApi;
export default ({
  modalVisible,
  closeModal,
  currentNRBand,
  refreshLTEBand,
}) => {
  //本弹窗内的选择项
  const [selectLTEBand, setSelectLTEBand] = useState([]);
  const [LTEBandList, setLTEBandList] = useState([]);
  //弹窗打开事件
  const dialogOpen = () => {
    const { LTE_Band } = currentNRBand;
    setSelectLTEBand(LTE_Band);
  };
  const getBandList = async () => {
    const LTEBandList = await ipcRenderer.invoke(
      "getJsonFileByFilePath",
      "app/LTE_Band_List.json"
    );
    setLTEBandList(LTEBandList);
  };
  useEffect(() => {
    getBandList();
  }, []);
  useEffect(() => {
    if (modalVisible) {
      dialogOpen();
    }
  }, [modalVisible]);

  const onChange = (list) => {
    setSelectLTEBand(list);
  };
  const submit = () => {
    refreshLTEBand(selectLTEBand);
    closeModal();
  };
  return (
    <Modal
      keyboard={false}
      maskClosable={false}
      title={`选择NR-Band / ${currentNRBand.Band}对应的LTE-Band`}
      open={modalVisible}
      onCancel={closeModal}
      centered={true}
      onOk={submit}
      width={500}
    >
      <div className="select-band-modal-content">
        <Checkbox.Group value={selectLTEBand} onChange={onChange}>
          {LTEBandList.map(({ Band }) => {
            return (
              <Checkbox value={Band} key={Band}>
                {Band}
              </Checkbox>
            );
          })}
        </Checkbox.Group>
      </div>
    </Modal>
  );
};
