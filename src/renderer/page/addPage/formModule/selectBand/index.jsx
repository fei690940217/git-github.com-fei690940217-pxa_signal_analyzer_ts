/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\formModule\selectBand\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-05 11:51:12
 * @Descripttion:  Band-Tag列表,纯展示,无其他作用
 */
import { Tag, Table, ConfigProvider } from "antd";
import "./index.scss";
const { Column } = Table;
//设置预设名称
const App = ({ selectBand, showLTE }) => {
  //裂变
  const NR_BWColumnRender = (text, record, index) => {
    const { BW } = record;
    if (BW && BW?.length) {
      return BW.join("/");
    } else {
      return "";
    }
  };
  //ARFCN
  const ARFCNColumnRender = (text, record, index) => {
    const { ARFCN } = record;
    const arr = ["Low", "Mid", "High"];
    if (ARFCN && ARFCN?.length) {
      let tempArr = ARFCN.map((index) => {
        return arr[index];
      });
      return tempArr.join("/");
    } else {
      return "";
    }
  };
  const SCSColumnRender = (text, record, index) => {
    const { SCS } = record;
    if (SCS && SCS?.length) {
      return SCS.join("/");
    } else {
      return "";
    }
  };
  const LTE_BandColumnRender = (text, record, index) => {
    const { LTE_Band } = record;
    if (LTE_Band?.length > 0) {
      return LTE_Band.join("/");
    } else {
      return "";
    }
  };
  const rowKeyFn = (row) => {
    const { Band } = row;
    return Band;
  };
  return (
    <div style={{ marginBottom: 14 }} className="select-band-container">
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: "#ccc",
          },
        }}
      >
        <Table
          size="small"
          dataSource={selectBand}
          rowKey={rowKeyFn}
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
          {showLTE && (
            <Column
              title="LTE"
              width={40}
              dataIndex="LTE_Band"
              ellipsis={true}
              render={LTE_BandColumnRender}
            />
          )}
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
