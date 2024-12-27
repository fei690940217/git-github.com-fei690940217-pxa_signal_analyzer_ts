/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:21:27
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\NRBWColumn\index.tsx
 * @Description: 项目列表主表格
 */

import { Select } from 'antd';
import { cloneDeep } from 'lodash';
import { NR_BW_LIST } from '@src/renderer/page/addPage/formModule/util/formData';
import { BandItemInfo } from '@src/customTypes/renderer';
import { setSelectBand } from '@src/renderer/store/modules/projectList';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';

//
type PropsType = {
  row: BandItemInfo;
};
export default ({ row }: PropsType) => {
  const dispatch = useAppDispatch();
  //本弹窗内的选择项
  const selectBand = useAppSelector((state) => state.projectList.selectBand);
  const BW_Change = (value: number[]) => {
    value.sort((a, b) => a - b);
    const tempSelectBand = cloneDeep(selectBand);
    const tempList = tempSelectBand.map((item) => {
      if (item.id === row.id) {
        item.BW = value;
      }
      return item;
    });
    dispatch(setSelectBand(tempList));
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
