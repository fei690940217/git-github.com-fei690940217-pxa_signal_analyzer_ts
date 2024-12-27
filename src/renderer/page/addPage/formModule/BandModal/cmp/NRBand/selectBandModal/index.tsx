/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:47:21
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\NRBand\selectBandModal\index.tsx
 * @Description: 项目列表主表格
 */

import { Modal, Radio, Checkbox } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useState, useEffect } from 'react';
import './index.scss';
import { BandItemInfo } from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import { setSelectBand } from '@src/renderer/store/modules/projectList';
import { cloneDeep } from 'lodash';
type BandObjType = {
  TDD: BandItemInfo[];
  FDD: BandItemInfo[];
};
type PropsType = {
  modalVisible: boolean;
  closeModal: () => void;
  row: BandItemInfo;
  bandObj: BandObjType;
};
export default ({ modalVisible, closeModal, row, bandObj }: PropsType) => {
  const dispatch = useAppDispatch();
  const selectBand = useAppSelector((state) => state.projectList.selectBand);
  //本弹窗内的选择项
  const [radioGroupValue, setRadioGroupValue] = useState<string>('');
  //弹窗打开事件
  const dialogOpen = () => {
    setRadioGroupValue(row?.Band);
  };
  useEffect(() => {
    if (modalVisible) {
      dialogOpen();
    }
  }, [modalVisible]);

  const submit = () => {
    if (radioGroupValue) {
      const tempSelectBand = cloneDeep(selectBand);
      const tempList = tempSelectBand.map((item) => {
        if (item.id === row.id) {
          item.Band = radioGroupValue;
        }
        return item;
      });
      dispatch(setSelectBand(tempList));
      closeModal();
    }
  };
  //组的变化
  const onSelectBandGroupChange = (checkedValues: RadioChangeEvent) => {
    console.log('onSelectBandGroupChange ', checkedValues);
  };
  return (
    <Modal
      keyboard={false}
      maskClosable={false}
      title={`选择NR-Band`}
      open={modalVisible}
      onCancel={closeModal}
      centered={true}
      onOk={submit}
      width={700}
      wrapClassName="select-band-modal-wrapper"
    >
      <div className="select-band-modal-content">
        {/* 待选区域 */}
        <div className="select-band-modal-content-bottom">
          <Radio.Group
            value={radioGroupValue}
            onChange={onSelectBandGroupChange}
          >
            <div className="select-band-checkbox">
              <div style={{ display: 'flex', marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    margin: '10px 0',
                    width: 50,
                  }}
                >
                  FDD
                </div>
                <div className="band-checkbox-wrapper" style={{ flex: 1 }}>
                  {bandObj.FDD.map((BandObj) => {
                    const { Band } = BandObj;
                    return (
                      <div key={Band} className="band-checkbox-item">
                        <Radio value={Band}>{Band}</Radio>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: 'flex', marginBottom: 18 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    margin: '10px 0',
                    width: 50,
                  }}
                >
                  TDD
                </div>
                <div className="band-checkbox-wrapper" style={{ flex: 1 }}>
                  {bandObj.TDD.map((BandObj) => {
                    const { Band } = BandObj;
                    return (
                      <div key={Band} className="band-checkbox-item">
                        <Radio value={Band}>{Band}</Radio>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Radio.Group>
        </div>
      </div>
    </Modal>
  );
};
