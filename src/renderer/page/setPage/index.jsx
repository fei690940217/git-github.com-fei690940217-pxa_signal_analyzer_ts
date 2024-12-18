/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\setPage\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-05 16:18:18
 * @Descripttion:  全局设置
 */
import { Row, Col } from "antd";
import "./index.scss";
import SpectrumConfig from "./spectrumConfig";
import LineLossTable from "./lineLossTable";

const App = () => {
  return (
    <Row className="set-wrapper" gutter={5}>
      <Col span={12}>
        <SpectrumConfig />
      </Col>
      <Col span={12}>
        <LineLossTable />
      </Col>
    </Row>
  );
};
export default App;
