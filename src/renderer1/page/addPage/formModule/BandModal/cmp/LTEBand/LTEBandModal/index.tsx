/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-08 17:24:30
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\formModule\BandModal\cmp\LTEBand\LTEBandModal\index.tsx
 * @Description: 项目列表主表格
 */
import { Modal, Radio, Checkbox } from 'antd';
import React, { useState, useEffect, useMemo, lazy } from 'react';
import './index.scss';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import { setAddFormValue } from '@src/renderer/store/modules/projectList';
import { cloneDeep } from 'lodash';
import { BandItemInfo } from '@src/customTypes/renderer';
type PropsType = {
  modalVisible: boolean;
  closeModal: () => void;
  row: any;
  LTEBandList: any[];
  changeSelectBand: (value: BandItemInfo[]) => void;
};
export default ({
  modalVisible,
  closeModal,
  row,
  LTEBandList,
  changeSelectBand,
}: PropsType) => {
  const dispatch = useAppDispatch();
  // const selectBand = useAppSelector((state) => state.projectList.selectBand);
  const addFormValue = useAppSelector(
    (state) => state.projectList.addFormValue,
  );
  const { selectBand } = addFormValue;
  const { LTE_Band, Band } = row;
  //本弹窗内的选择项
  const [selectLTEBand, setSelectLTEBand] = useState<string[]>([]);
  //弹窗打开事件
  const dialogOpen = () => {
    setSelectLTEBand(LTE_Band);
  };
  useEffect(() => {
    if (modalVisible) {
      dialogOpen();
    }
  }, [modalVisible]);

  const onChange = (list: string[]) => {
    setSelectLTEBand(list);
  };
  const submit = () => {
    const LTE_Band = Array.isArray(selectLTEBand) ? selectLTEBand : [];
    const tempSelectBand = cloneDeep(selectBand);
    const tempList = tempSelectBand.map((item) => {
      if (item.id === row.id) {
        item.LTE_Band = LTE_Band;
      }
      return item;
    });
    changeSelectBand(tempList);
    closeModal();
  };
  return (
    <Modal
      keyboard={false}
      maskClosable={false}
      title={`选择NR-Band / ${Band}对应的LTE-Band`}
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
