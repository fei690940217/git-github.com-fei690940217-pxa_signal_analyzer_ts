/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-11 15:57:14
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\RBPlanTable\RBTableItem\index.jsx
 * @Description: 勾选测试项页面
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { Table, ConfigProvider } from "antd";
import RBTableObj from "@/page/addPage/formModule/util/RBTableObj.js";

const { Column } = Table;
//props testItem 测试用例
export default ({ testItem, RBSelectedRowKeys, setRBSelectedRowKeys }) => {
  const RBTableList = RBTableObj[testItem];
  const isHiddenChannel = testItem !== "BandEdge";
  const tableRowSelection = {
    type: "checkbox",
    checkStrictly: false,
    selectedRowKeys: RBSelectedRowKeys,
    onChange: (selectedRowKeys) => {
      setRBSelectedRowKeys(selectedRowKeys);
    },
  };
  //OFDM列自定义渲染
  const OFDMColumnRender = (text, row, index) => {
    if (text) {
      const OFDM = text === "DFT" ? "DFT-s-OFDM" : "CP-OFDM";
      return OFDM;
    } else {
      return "";
    }
  };
  const ChannelColumnRender = (text, row, index) => {
    if (text) {
      const Channel = text === "H" ? "High" : "Low";
      return Channel;
    } else {
      return "";
    }
  };
  return (
    <div className="add-project-sub-test-plan-wrapper">
      <ConfigProvider
        theme={{
          token: {
            colorBorderSecondary: "#ccc",
          },
        }}
      >
        <Table
          style={{ height: "100%", overflow: "hidden" }}
          rowSelection={tableRowSelection}
          size="small"
          dataSource={RBTableList}
          bordered={true}
          rowKey="id"
          pagination={false}
          scroll={{
            y: "auto",
          }}
        >
          {/* 序号 */}
          <Column
            align="center"
            title="No."
            width={60}
            render={(text, record, index) => index + 1}
          />
          {/* 调制 */}
          <Column
            width={70}
            title="Channel"
            dataIndex="level"
            render={ChannelColumnRender}
            hidden={isHiddenChannel}
          />
          {/* 调制 */}
          <Column
            width={160}
            title="OFDM"
            dataIndex="OFDM"
            key="OFDM"
            ellipsis={true}
            render={OFDMColumnRender}
          />
          {/* 调制 */}
          <Column
            width={120}
            title="Modulation"
            dataIndex="modulate"
            key="modulate"
            ellipsis={true}
          />
          {/* RB */}
          <Column title="RB" dataIndex="RB" key="RB" ellipsis={true} />
        </Table>
      </ConfigProvider>
    </div>
  );
};
