/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\selectBand\index.tsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-27 17:51:10
 * @Descripttion:  Band-Tag列表,纯展示,无其他作用
 */
import { Table, ConfigProvider } from 'antd';
import './index.scss';
import { BandItemInfo } from '@src/customTypes/renderer';
import { useAppSelector } from '@src/renderer/hook';

const { Column } = Table;
//设置预设名称
type PropsType = {
  showLTE: boolean; //是否展示LTE
};
const App = ({ showLTE }: PropsType) => {
  const selectBand = useAppSelector((state) => state.projectList.selectBand);
  //裂变
  const NR_BWColumnRender = (_: any, record: BandItemInfo) => {
    const { BW } = record;
    if (BW && BW?.length) {
      return BW.join('/');
    } else {
      return '';
    }
  };
  //ARFCN
  const ARFCNColumnRender = (_: any, record: BandItemInfo) => {
    const { ARFCN } = record;
    const arr = ['Low', 'Mid', 'High'];
    if (ARFCN && ARFCN?.length) {
      let tempArr = ARFCN.map((index) => {
        return arr[index];
      });
      return tempArr.join('/');
    } else {
      return '';
    }
  };
  const SCSColumnRender = (_: any, record: BandItemInfo) => {
    const { SCS } = record;
    if (SCS && SCS?.length) {
      return SCS.join('/');
    } else {
      return '';
    }
  };
  const LTE_BandColumnRender = (_: any, record: BandItemInfo) => {
    const { LTE_Band } = record;
    if (LTE_Band && LTE_Band?.length > 0) {
      return LTE_Band.join('/');
    } else {
      return '';
    }
  };
  return (
    <div style={{ marginBottom: 14 }} className="select-band-container">
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: '#ccc',
          },
        }}
      >
        <Table<BandItemInfo>
          size="small"
          dataSource={selectBand}
          rowKey="id"
          bordered
          pagination={false}
          scroll={{
            x: true,
          }}
        >
          {/* NR-Band */}
          <Column
            title="NR"
            dataIndex="Band"
            key="Band"
            ellipsis={true}
            width={60}
          />
          {/* LTE-Band */}
          <Column
            hidden={!showLTE}
            title="LTE"
            width={40}
            dataIndex="LTE_Band"
            ellipsis={true}
            render={LTE_BandColumnRender}
          />
          {/* SCS */}
          <Column
            width={40}
            title="SCS"
            dataIndex="SCS"
            key="SCS"
            ellipsis={true}
            render={SCSColumnRender}
          />
          {/* BW */}
          <Column
            title="NR_BW"
            dataIndex="BW"
            key="BW"
            ellipsis={true}
            render={NR_BWColumnRender}
          />
          {/* BW */}
          <Column
            width={80}
            title="NR_ARFCN"
            dataIndex="ARFCN"
            key="ARFCN"
            ellipsis={true}
            render={ARFCNColumnRender}
          />
        </Table>
      </ConfigProvider>
    </div>
  );
};
export default App;
