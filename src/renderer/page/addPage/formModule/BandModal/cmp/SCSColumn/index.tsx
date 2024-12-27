/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:21:54
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\SCSColumn\index.tsx
 * @Description: 项目列表主表格
 */

import { Select } from 'antd';
import { cloneDeep } from 'lodash';
import { BandItemInfo } from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import { setSelectBand } from '@src/renderer/store/modules/projectList';
//
type PropsType = {
  row: BandItemInfo;
};
export default ({ row }: PropsType) => {
  const dispatch = useAppDispatch();
  //本弹窗内的选择项
  const selectBand = useAppSelector((state) => state.projectList.selectBand);
  const SCS_Change = (value: number[]) => {
    value.sort((a, b) => a - b);
    const tempSelectBand = cloneDeep(selectBand);
    const tempList = tempSelectBand.map((item) => {
      if (item.id === row.id) {
        item.SCS = value;
      }
      return item;
    });
    dispatch(setSelectBand(tempList));
  };

  return (
    <div className="lte-band-column-wrapper">
      <Select
        size="small"
        onChange={SCS_Change}
        value={row.SCS}
        filterOption={false}
        mode="multiple"
        placeholder="Select SCS"
        style={{
          width: '100%',
        }}
        options={[
          {
            value: 15,
            label: '15KHz',
          },
          {
            value: 30,
            label: '30KHz',
          },
          {
            value: 60,
            label: '60KHz',
          },
        ]}
      />
    </div>
  );
};
