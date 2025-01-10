/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 16:39:59
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\formModule\BandModal\cmp\ARFCNColumn\index.tsx
 * @Description: 项目列表主表格
 */

import { Select } from 'antd';
import './index.scss';
import { useAppSelector } from '@src/renderer1/hook';
import { cloneDeep } from 'lodash';
import { BandItemInfo } from '@src/customTypes/renderer';
//
type PropsType = {
  row: BandItemInfo;
  changeSelectBand: (value: BandItemInfo[]) => void;
};
export default ({ row, changeSelectBand }: PropsType) => {
  const addFormValue = useAppSelector((state) => state.addFormValue);
  const { selectBand } = addFormValue;
  const ARFCN_Change = (value: number[]) => {
    //排序
    value.sort((a, b) => a - b);
    const tempSelectBand = cloneDeep(selectBand);
    const tempList = tempSelectBand.map((item) => {
      if (item.id === row.id) {
        item.ARFCN = value;
      }
      return item;
    });
    changeSelectBand(tempList);
  };
  return (
    <div className="lte-band-column-wrapper">
      <Select
        size="small"
        onChange={ARFCN_Change}
        value={row?.ARFCN}
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
    </div>
  );
};
