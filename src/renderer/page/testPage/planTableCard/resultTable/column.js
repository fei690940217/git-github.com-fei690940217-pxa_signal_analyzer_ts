/*
 * @Author: feifei
 * @Date: 2024-12-04 09:48:29
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 15:17:23
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\planTableCard\resultTable\column.js
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */
import {
  ConfigProvider,
  Table,
  Button,
  Tooltip,
  message,
  notification,
} from 'antd';
import {
  PictureOutlined,
  PlayCircleOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { verdictHandle, FullAbbreviationTable } from '@src/common/index.ts';
const { ipcRenderer } = window.myApi;

const testItemColumnRender = (text, record) => {
  const { testItem } = record;
  return FullAbbreviationTable[testItem];
};
const OFDMColumnRender = (text, record, index) => {
  if (record?.modulate) {
    const { modulate, OFDM } = record;
    const str = `${OFDM}-${modulate}`;
    return str;
  } else {
    return '';
  }
};
//是否合格列的自定义内容
const verdictColumnRender = (text, record, index) => {
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
const rangeColumnRender = (text, record) => {
  const { rangeStart, rangeStop } = record;
  if (rangeStart && rangeStop) {
    let start = null;
    if (rangeStart >= 1000) {
      start = rangeStart / 1000 + 'GHz';
    } else {
      start = rangeStart + 'MHz';
    }
    let stop = null;
    if (rangeStop >= 1000) {
      stop = rangeStop / 1000 + 'GHz';
    } else {
      stop = rangeStop + 'MHz';
    }
    return `${start}-${stop}`;
  } else {
    return '';
  }
};
//Frequency结果列
const FrequencyResultColumnRender = (text, record) => {
  const { result } = record;
  if (result) {
    const [Frequency, Level] = result?.split(',');
    return `${Frequency}`;
  } else {
    return '';
  }
};
//level结果列处理
const LevelResultColumnRender = (text, record) => {
  const { result } = record;
  if (result) {
    const [Frequency, Level] = result?.split(',');
    return `${Level}`;
  } else {
    return '';
  }
};
const BandColumnRender = (text, record) => {
  const { Band, LTE_Band, networkMode } = record;
  if (networkMode === 'NSA' && LTE_Band) {
    return `${LTE_Band}_${Band}`;
  } else {
    return Band;
  }
};
const beforeColumns = [
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
    title: 'RB',
    width: 50,
    dataIndex: 'RBNum',
    ellipsis: true,
    render: (text, record, index) => {
      const { RBNum, RBStart } = record;
      const str = `${RBNum} / ${RBStart}`;
      return str;
    },
  },
];
//之后
const afterColumnsHandler = (showScreenCapture, deleteResult) => {
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
      title: '/',
      width: 50,
      render: (text, record, index) => {
        if (record?.result) {
          return (
            <PictureOutlined
              onClick={() => showScreenCapture(record.id)}
              style={{ fontSize: '12px', color: '#36c' }}
            />
          );
        } else {
          return '';
        }
      },
    },
    //delete
    {
      align: 'center',
      title: 'Del',
      width: 50,
      render: (text, record, index) => {
        const { result } = record;
        if (result) {
          return (
            <Tooltip title="删除本条结果" color="#F56C6C">
              <Button
                size="small"
                onClick={() => deleteResult(record)}
                type="link"
                icon={
                  <DeleteOutlined style={{ fontSize: 12, color: '#F56C6C' }} />
                }
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

const CSEColumns = [
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
const OBWresultColumnRender = (text, record, index) => {
  const { testItem, result } = record;
  if (result) {
    const [obw, BW26dB] = result.split(',');
    return `${obw}`;
  } else {
    return '';
  }
};
const dB26resultColumnRender = (text, record, index) => {
  const { testItem, result } = record;
  if (result) {
    const [obw, BW26dB] = result.split(',');
    return `${BW26dB}`;
  } else {
    return '';
  }
};

const OBWColumns = [
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
    render: (text, record) => record?.BW,
  },
];

//自定义结果列
const resultColumnRender = (text, record, index) => {
  const { result } = record;
  if (result) {
    return result;
  } else {
    return '';
  }
};
const PARColumns = [
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

export default (testItem, showScreenCapture, deleteResult) => {
  const afterColumns = afterColumnsHandler(showScreenCapture, deleteResult);
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
