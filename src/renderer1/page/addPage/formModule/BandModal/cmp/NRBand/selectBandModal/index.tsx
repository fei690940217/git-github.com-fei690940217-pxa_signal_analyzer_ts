/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-08 17:26:56
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\formModule\BandModal\cmp\NRBand\selectBandModal\index.tsx
 * @Description: 项目列表主表格
 */

import { Modal, Radio, message } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { useState, useEffect } from 'react';
import './index.scss';
import { BandItemInfo } from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import { setAddFormValue } from '@src/renderer/store/modules/projectList';
import { cloneDeep } from 'lodash';
import { BandItemType } from '@src/customTypes/main';

type BandObjType = {
  TDD: BandItemType[];
  FDD: BandItemType[];
};
type PropsType = {
  modalVisible: boolean;
  closeModal: () => void;
  row: BandItemInfo;
  bandObj: BandObjType;
  changeSelectBand: (value: BandItemInfo[]) => void;
};
export default ({
  modalVisible,
  closeModal,
  row,
  bandObj,
  changeSelectBand,
}: PropsType) => {
  const dispatch = useAppDispatch();
  const addFormValue = useAppSelector(
    (state) => state.projectList.addFormValue,
  );
  const { selectBand } = addFormValue;
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
      //先验证一下是否重复选择
      const findIndex = tempSelectBand.findIndex((item) => {
        //如果是当前行就不管了,随便重复
        if (item.id == row.id) {
          return false;
        }
        //如果不是当前行，就判断是否重复
        return item.Band === radioGroupValue;
      });
      if (findIndex >= 0) {
        return message.error('Band已存在,请重新选择!');
      }
      const tempList = tempSelectBand.map((item) => {
        if (item.id === row.id) {
          const allBandList = [...bandObj.FDD, ...bandObj.TDD];
          //找到数据库中的Band信息
          const dbBandItem = allBandList.find((dbBandItem) => {
            return dbBandItem.Band === radioGroupValue;
          });
          if (dbBandItem) {
            const { FL, FH, CSE_Limit, duplexMode } = dbBandItem;
            return {
              ...item,
              Band: radioGroupValue,
              FL: FL || 0,
              FH: FH || 0,
              CSE_Limit: CSE_Limit || 0,
              duplexMode: duplexMode || 'FDD',
            };
          }
        }
        return item;
      });
      changeSelectBand(tempList);
      closeModal();
    }
  };
  //组的变化
  const onSelectBandGroupChange = (e: RadioChangeEvent) => {
    const { checked, value } = e.target;
    if (checked) {
      setRadioGroupValue(value);
    }
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
