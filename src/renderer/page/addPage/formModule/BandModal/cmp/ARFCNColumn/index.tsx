/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:19:32
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\BandModal\cmp\ARFCNColumn\index.tsx
 * @Description: 项目列表主表格
 */

import { Table, message, Modal, Checkbox, Select, Button, Tooltip } from 'antd';
import type { GetProp, CheckboxProps } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useState, useEffect, useMemo, lazy } from 'react';
import './index.scss';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';
import { cloneDeep } from 'lodash';
import { BandItemInfo } from '@src/customTypes/renderer';
import { setAddFormValue } from '@src/renderer/store/modules/projectList';
//
type PropsType = {
  row: BandItemInfo;
};
export default ({ row }: PropsType) => {
  const dispatch = useAppDispatch();
  //本弹窗内的选择项
  // const selectBand = useAppSelector((state) => state.selectBand);
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
    dispatch(setAddFormValue({ ...addFormValue, selectBand: tempList }));
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
