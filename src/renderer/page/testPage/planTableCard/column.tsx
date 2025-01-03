/*
 * @Author: feifei
 * @Date: 2024-12-04 09:48:29
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 14:38:48
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\planTableCard\column.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import { Button, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import {
  PictureOutlined,
  PictureTwoTone,
  DeleteOutlined,
  DeleteTwoTone,
} from '@ant-design/icons';
import { verdictHandle } from '@src/common';
import { ResultItemType, TestItemType } from '@src/customTypes/renderer';

const OFDMColumnRender = (text: string, record: ResultItemType) => {
  if (record?.modulate) {
    const { modulate, OFDM } = record;
    const str = `${OFDM}-${modulate}`;
    return str;
  } else {
    return '';
  }
};
//是否合格列的自定义内容
const verdictColumnRender = (text: any, record: ResultItemType) => {
  const { result } = record;
  if (result) {
    let flag = verdictHandle(record);
    if (flag) {
      return <div style={{ fontWeight: 600, color: '#67c23a' }}>PASS</div>;
    } else {
      return <div style={{ fontWeight: 600, color: '#f56c6c' }}>FAIL</div>;
    }
  } else {
    return '';
  }
};

//range
const rangeColumnRender = (text: any, record: ResultItemType) => {
  const { rangeStart, rangeStop } = record;
  const NumrangeStart = Number(rangeStart);
  const NumrangeStop = Number(rangeStop);

  if (rangeStart && rangeStop) {
    let start = null;
    if (NumrangeStart >= 1000) {
      start = NumrangeStart / 1000 + 'GHz';
    } else {
      start = rangeStart + 'MHz';
    }
    let stop = null;
    if (NumrangeStop >= 1000) {
      stop = NumrangeStop / 1000 + 'GHz';
    } else {
      stop = rangeStop + 'MHz';
    }
    return `${start}-${stop}`;
  } else {
    return '';
  }
};
//Frequency结果列
const FrequencyResultColumnRender = (text: any, record: ResultItemType) => {
  const { result } = record;
  if (result) {
    const [Frequency, Level] = result?.split(',');
    return `${Frequency}`;
  } else {
    return '';
  }
};
//level结果列处理
const LevelResultColumnRender = (text: any, record: ResultItemType) => {
  const { result } = record;
  if (result) {
    const [Frequency, Level] = result?.split(',');
    return `${Level}`;
  } else {
    return '';
  }
};
const BandColumnRender = (text: any, record: ResultItemType) => {
  const { Band, LTE_Band, networkMode } = record;
  if (networkMode === 'NSA' && LTE_Band) {
    return `${LTE_Band}_${Band}`;
  } else {
    return Band;
  }
};
const beforeColumns: TableProps<ResultItemType>['columns'] = [
  {
    align: 'center',
    title: 'ID',
    width: 40,
    dataIndex: 'id',
  },
  {
    title: 'Test Item',
    width: 60,
    dataIndex: 'testItem',
    ellipsis: true,
  },
  {
    title: 'Band',
    width: 120,
    dataIndex: 'Band',
    ellipsis: true,
    render: BandColumnRender,
  },
  {
    align: 'center',
    title: 'SCS(KHz)',
    width: 60,
    dataIndex: 'SCS',
    ellipsis: true,
  },
  {
    align: 'center',
    title: 'BW(MHz)',
    width: 60,
    dataIndex: 'BW',
    ellipsis: true,
  },
  {
    align: 'center',
    title: 'ARFCN',
    width: 60,
    dataIndex: 'ARFCN',
    ellipsis: true,
  },
  {
    title: 'Modulation',
    width: 90,
    dataIndex: 'OFDM',
    ellipsis: true,
    render: OFDMColumnRender,
  },
  {
    title: 'RB (num/start)',
    width: 80,
    dataIndex: 'RBNum',
    ellipsis: true,
    render: (text: number, record: ResultItemType) => {
      const { RBNum, RBStart } = record;
      const str = `${RBNum} / ${RBStart}`;
      return str;
    },
  },
];
//之后
const afterColumnsHandler = (
  showScreenCapture: (id: number) => void,
  deleteResult: (row: ResultItemType) => void,
): TableProps<ResultItemType>['columns'] => {
  return [
    ///--------
    //判定结果
    {
      align: 'center',
      title: 'Verdict',
      width: 50,
      ellipsis: true,
      render: verdictColumnRender,
    },
    //截图
    {
      align: 'center',
      title: 'Pic',
      width: 50,
      render: (text: any, record: ResultItemType) => {
        if (record?.result) {
          return (
            <PictureTwoTone onClick={() => showScreenCapture(record.id)} />
          );
        } else {
          return '';
        }
      },
    },
    //delete
    {
      align: 'center',
      title: 'Clear',
      width: 50,
      render: (text: any, record: ResultItemType) => {
        const { result } = record;
        if (result) {
          return (
            <Tooltip title="删除本条结果" color="#F56C6C">
              <Button
                size="small"
                onClick={() => deleteResult(record)}
                type="link"
                icon={<DeleteTwoTone twoToneColor="#ff7875" />}
              />
            </Tooltip>
          );
        } else {
          return '';
        }
      },
    },
  ];
};

const CSEColumns: TableProps<ResultItemType>['columns'] = [
  // 插入部分其他列
  ///--------
  //ces
  {
    align: 'center',
    title: 'rangeStart',
    width: 80,
    dataIndex: 'rangeStart',
    ellipsis: true,
    render: rangeColumnRender,
  },
  {
    align: 'center',
    title: 'Frequency(MHz)',
    width: 80,
    dataIndex: 'result',
    ellipsis: true,
    render: FrequencyResultColumnRender,
  },
  {
    align: 'center',
    title: 'Level(dBm)',
    width: 60,
    dataIndex: 'result',
    ellipsis: true,
    render: LevelResultColumnRender,
  },
  {
    align: 'center',
    title: 'Limit(dB)',
    width: 60,
    dataIndex: 'CSE_Limit',
    ellipsis: true,
  },
];

//自定义结果列
const OBWresultColumnRender = (text: any, record: ResultItemType) => {
  const { testItem, result } = record;
  if (result) {
    const [obw, BW26dB] = result.split(',');
    return `${obw}`;
  } else {
    return '';
  }
};
const dB26resultColumnRender = (text: any, record: ResultItemType) => {
  const { testItem, result } = record;
  if (result) {
    const [obw, BW26dB] = result.split(',');
    return `${BW26dB}`;
  } else {
    return '';
  }
};

const OBWColumns: TableProps<ResultItemType>['columns'] = [
  // 插入部分其他列
  {
    align: 'center',
    title: 'OBW(MHz)',
    width: 60,
    dataIndex: 'result',
    ellipsis: true,
    render: OBWresultColumnRender,
  },
  {
    align: 'center',
    title: '26dBBW(MHz)',
    width: 80,
    dataIndex: 'result',
    ellipsis: true,
    render: dB26resultColumnRender,
  },
  {
    align: 'center',
    title: 'Limit(MHz)',
    width: 60,
    dataIndex: 'result',
    ellipsis: true,
    render: (text: any, record: ResultItemType) => record?.BW,
  },
];

//自定义结果列
const resultColumnRender = (text: any, record: ResultItemType) => {
  const { result } = record;
  if (result) {
    return result;
  } else {
    return '';
  }
};
const PARColumns: TableProps<ResultItemType>['columns'] = [
  // 插入部分其他列
  {
    align: 'center',
    title: 'Result(dB)',
    width: 80,
    dataIndex: 'result',
    ellipsis: true,
    render: resultColumnRender,
  },
  {
    align: 'center',
    title: 'Limit(MHz)',
    width: 60,
    dataIndex: 'result',
    ellipsis: true,
    render: () => 13,
  },
];

//根据传递进来的testItem判断表格

export default (
  testItem: TestItemType,
  showScreenCapture: (id: number) => void,
  deleteResult: (row: ResultItemType) => void,
): TableProps<ResultItemType>['columns'] => {
  const afterColumns: TableProps<ResultItemType>['columns'] =
    afterColumnsHandler(showScreenCapture, deleteResult) || [];
  if (testItem === 'BandEdge' || testItem === 'BandEdgeIC') {
    return beforeColumns.concat(afterColumns);
  } else if (testItem === 'PAR') {
    return beforeColumns.concat(PARColumns, afterColumns);
  } else if (testItem === 'OBW') {
    return beforeColumns.concat(OBWColumns, afterColumns);
  } else if (testItem === 'CSE') {
    return beforeColumns.concat(CSEColumns, afterColumns);
  } else {
    return beforeColumns.concat(afterColumns);
  }
};
