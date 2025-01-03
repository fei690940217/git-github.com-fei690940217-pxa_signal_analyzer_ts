/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-30 15:44:10
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\NRBWColumn\index.tsx
 * @Description: 项目列表主表格
 */

import { Select } from 'antd';
import { cloneDeep } from 'lodash';
import { BandItemInfo } from '@src/customTypes/renderer';
import { setAddFormValue } from '@src/renderer/store/modules/projectList';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';
const NR_BW_LIST = [
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 20, value: 20 },
  { label: 25, value: 25 },
  { label: 30, value: 30 },
  { label: 40, value: 40 },
  { label: 50, value: 50 },
  { label: 60, value: 60 },
  { label: 70, value: 70 },
  { label: 80, value: 80 },
  { label: 90, value: 90 },
  { label: 100, value: 100 },
];
//
type PropsType = {
  row: BandItemInfo;
};
export default ({ row }: PropsType) => {
  const dispatch = useAppDispatch();
  //本弹窗内的选择项
  const addFormValue = useAppSelector(
    (state) => state.projectList.addFormValue,
  );
  const { selectBand } = addFormValue;
  const BW_Change = (value: number[]) => {
    value.sort((a, b) => a - b);
    const tempSelectBand = cloneDeep(selectBand);
    const tempList = tempSelectBand.map((item) => {
      if (item.id === row.id) {
        item.BW = value;
      }
      return item;
    });
    dispatch(setAddFormValue({ ...addFormValue, selectBand: tempList }));
  };
  return (
    <div className="lte-band-column-wrapper">
      <Select
        size="small"
        onChange={BW_Change}
        value={row.BW}
        style={{
          width: '100%',
        }}
        mode="multiple"
        allowClear
        placeholder="Select NR_BW"
        options={NR_BW_LIST}
      />
    </div>
  );
};
