/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:56:54
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\LTEBand\LTEBandModal\index.tsx
 * @Description: 项目列表主表格
 */
import { Modal, Radio, Checkbox } from 'antd';
import React, { useState, useEffect, useMemo, lazy } from 'react';
import './index.scss';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import { setSelectBand } from '@src/renderer/store/modules/projectList';
import { cloneDeep } from 'lodash';
type PropsType = {
  modalVisible: boolean;
  closeModal: () => void;
  row: any;
  LTEBandList: any[];
};
export default ({ modalVisible, closeModal, row, LTEBandList }: PropsType) => {
  const dispatch = useAppDispatch();
  const selectBand = useAppSelector((state) => state.projectList.selectBand);
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
    console.log('LTE_Band_list', list);
    setSelectLTEBand(list);
  };
  const submit = () => {
    if (selectLTEBand?.length) {
      const tempSelectBand = cloneDeep(selectBand);
      const tempList = tempSelectBand.map((item) => {
        if (item.id === row.id) {
          item.LTE_Band = selectLTEBand;
        }
        return item;
      });
      dispatch(setSelectBand(tempList));
      closeModal();
    } else {
      //给个提示
    }
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
