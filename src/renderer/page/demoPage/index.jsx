/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\demoPage\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 15:06:39
 * @Descripttion:  基站设置
 */
import { Button, Form, Input, message, Card, Radio, Tag, Tooltip } from "antd";
import {
  PictureOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import React, { useEffect, useMemo, useState } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { setIsPermission } from "@/store/modules/home";

import { useNetwork } from "ahooks";
import {
  check_auth,
  get_instr_list,
  create_instr_fn,
  query_fn,
  write_fn,
  set_timeout,
  get_soft_version,
} from "@/api/api";
import { delayTime } from "@/utils";
import { logError } from "@/utils/logLevel.js";

const { Search } = Input;
//基站,频谱连接名称
const { pinpuConnectionName, jizhanConnectionName } = window.myApi;

const App = () => {
  const [messageApi, messageContextHolder] = message.useMessage();

  const [baseStationReturnValue, setBaseStationReturnValue] = useState("");
  const [spectrumReturnValue, setSpectrumReturnValue] = useState("");
  //手动发送基站指令
  const sendBaseStationCommand = async (value) => {
    try {
      const isQuery = value?.includes("?");
      const params = {
        instr_name: jizhanConnectionName,
        command: value,
      };
      if (isQuery) {
        let rst = await query_fn(params);
        setBaseStationReturnValue(rst);
      } else {
        await write_fn(params);
      }
      messageApi.success("指令发送成功");
    } catch (error) {
      logError(error.toString());
      setBaseStationReturnValue(String(error));
    }
  };
  //手动发送频谱指令
  const sendSpectrumCommand = async (value) => {
    try {
      const isQuery = value?.includes("?");
      const params = {
        instr_name: pinpuConnectionName,
        command: value,
      };
      if (isQuery) {
        let rst = await query_fn(params);
        setSpectrumReturnValue(rst);
      } else {
        await write_fn(params);
      }
      return Promise.resolve();
    } catch (error) {
      console.error(error);
      setSpectrumReturnValue(String(error));
      return Promise.resolve();
    }
  };
  //测试按钮
  const clickk = async (num) => {
    let tempNum = Number(num);
    for (let i = 0; i < tempNum; i++) {
      const command = "*IDN?";
      await sendSpectrumCommand(command);
      // await sendSpectrumCommand(command2);
    }
  };
  const setTimeout = async (ms) => {
    const params = {
      instr_name: pinpuConnectionName,
      timeout: ms,
    };
    let res = await set_timeout(params);
    console.log(res);
  };
  const testFn = async () => {
    try {
      const params = {
        instr_name: pinpuConnectionName,
        timeout: 5000,
      };
      let timeoutRes = await set_timeout(params, { timeout: 8000 });
      console.log(timeoutRes);
      // let res = await get_soft_version("abc");
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="demo-page-wrapper">
      {messageContextHolder}
      <Card
        styles={{
          header: {
            minHeight: 36,
            lineHeight: "36px",
          },
        }}
        title="手动发送指令"
      >
        <Form
          style={{ width: 700 }}
          labelWrap
          labelAlign="left"
          labelCol={{ flex: "100px" }}
          wrapperCol={{
            flex: 1,
          }}
          layout="horizontal"
        >
          {/* 基站 */}
          <Form.Item label="基站">
            <Search
              placeholder="输入基站指令"
              allowClear
              enterButton="发送"
              size="large"
              onSearch={sendBaseStationCommand}
            />
            {/* 基站返回值 */}
            <div>{baseStationReturnValue}</div>
          </Form.Item>
          {/* 频谱 */}
          <Form.Item label="频谱">
            <Search
              placeholder="输入频谱指令"
              allowClear
              enterButton="发送"
              size="large"
              onSearch={sendSpectrumCommand}
            />
            <div>{spectrumReturnValue}</div>
          </Form.Item>
          {/* 测试按钮,无固定功能 */}
          <Form.Item label="循环指令">
            <Search
              placeholder="输入循环次数"
              allowClear
              enterButton="开始"
              size="large"
              onSearch={clickk}
            />
          </Form.Item>
          <Form.Item label="超时">
            <Search
              placeholder="ms"
              allowClear
              enterButton="设置"
              size="large"
              onSearch={setTimeout}
            />
          </Form.Item>
        </Form>
        <Button type="primary" ghost onClick={testFn}>
          其他测试
        </Button>
      </Card>
    </div>
  );
};
export default App;
