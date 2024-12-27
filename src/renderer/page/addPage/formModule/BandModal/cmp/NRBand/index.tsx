/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:48:05
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\NRBand\index.tsx
 * @Description: 项目列表主表格
 */

import { EditOutlined } from '@ant-design/icons';
import { useState } from 'react';
import './index.scss';
import SelectBandModal from './selectBandModal';
import { BandItemInfo } from '@src/customTypes/renderer';
type BandObjType = {
  TDD: BandItemInfo[];
  FDD: BandItemInfo[];
};
//
type PropsType = {
  row: BandItemInfo;
  bandObj: BandObjType;
};
export default ({ row, bandObj }: PropsType) => {
  //本弹窗内的选择项
  const [selectBandModalVisible, setSelectBandModalVisible] =
    useState<boolean>(false);
  const { Band } = row;
  const addBand = () => {
    setSelectBandModalVisible(true);
  };
  return (
    <div className="lte-band-column-wrapper">
      <SelectBandModal
        modalVisible={selectBandModalVisible}
        closeModal={() => setSelectBandModalVisible(false)}
        row={row}
        bandObj={bandObj}
      />
      {/* left */}
      <div className="lte-band-column-left">{Band}</div>
      <div className="lte-band-column-right">
        <EditOutlined
          style={{ color: '#36c', cursor: 'pointer' }}
          onClick={addBand}
        />
      </div>
    </div>
  );
};
