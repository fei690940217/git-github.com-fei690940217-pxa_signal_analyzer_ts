/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:42:49
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\LTEBand\index.tsx
 * @Description: 项目列表主表格
 */

import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './index.scss';
import { cloneDeep } from 'lodash';
import LTEBandModal from './LTEBandModal';
import { BandItemInfo } from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import { setSelectBand } from '@src/renderer/store/modules/projectList';
//
type PropsType = {
  row: BandItemInfo;
  LTEBandList: any;
};
export default ({ row, LTEBandList }: PropsType) => {
  const dispatch = useAppDispatch();
  const selectBand = useAppSelector((state) => state.projectList.selectBand);
  const { LTE_Band } = row;
  //本弹窗内的选择项
  const [LTEBandModalVisible, setLTEBandModalVisible] =
    useState<boolean>(false);
  const addLTEBand = () => {
    setLTEBandModalVisible(true);
  };
  //刷新LTE_Band
  const refreshLTEBand = (LTE_Band: string[]) => {
    const tempModalSelectBand = cloneDeep(selectBand);
    const list = tempModalSelectBand.map((item) => {
      if (item.id === row.id) {
        item.LTE_Band = LTE_Band;
      }
      return item;
    });
    dispatch(setSelectBand(list));
  };
  return (
    <div className="lte-band-column-wrapper">
      <LTEBandModal
        modalVisible={LTEBandModalVisible}
        closeModal={() => setLTEBandModalVisible(false)}
        row={row}
        LTEBandList={LTEBandList}
      />
      {/* left */}
      <div className="lte-band-column-left">{LTE_Band?.join(' , ')}</div>
      <div className="lte-band-column-right">
        <EditOutlined
          style={{ color: '#36c', cursor: 'pointer' }}
          onClick={addLTEBand}
        />
      </div>
    </div>
  );
};
