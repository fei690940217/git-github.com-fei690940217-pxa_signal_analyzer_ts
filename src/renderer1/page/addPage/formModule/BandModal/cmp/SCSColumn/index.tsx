/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 16:24:39
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\formModule\BandModal\cmp\SCSColumn\index.tsx
 * @Description: 项目列表主表格
 */

import { Select } from 'antd';
import { cloneDeep } from 'lodash';
import { BandItemInfo } from '@src/customTypes/renderer';
import { useAppSelector } from '@src/renderer1/hook';
//
type PropsType = {
  row: BandItemInfo;
  changeSelectBand: (value: BandItemInfo[]) => void;
};
export default ({ row, changeSelectBand }: PropsType) => {
  //本弹窗内的选择项
  const addFormValue = useAppSelector((state) => state.addFormValue);
  const { selectBand } = addFormValue;
  const SCS_Change = (value: number[]) => {
    value.sort((a, b) => a - b);
    const tempSelectBand = cloneDeep(selectBand);
    const tempList = tempSelectBand.map((item) => {
      if (item.id === row.id) {
        item.SCS = value;
      }
      return item;
    });
    changeSelectBand(tempList);
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
            label: '15',
          },
          {
            value: 30,
            label: '30',
          },
          {
            value: 60,
            label: '60',
          },
        ]}
      />
    </div>
  );
};
