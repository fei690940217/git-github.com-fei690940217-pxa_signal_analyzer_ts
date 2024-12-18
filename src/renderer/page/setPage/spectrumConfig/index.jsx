/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\setPage\spectrumConfig\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-10 11:33:41
 * @Descripttion:  基站设置
 */
import {
  Button,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Card,
  Radio,
  Space,
  notification,
} from "antd";
import { ApiOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import "./index.scss";
import { useSelector, useDispatch } from "react-redux";
import { setSpectrumConfig } from "@/store/modules/config";
import { useTranslation } from "react-i18next";
const { ipcRenderer } = window.myApi;

const ipReg =
  /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/;
const App = (props) => {
  const { t, i18n } = useTranslation("setPage");
  //表单实例
  const [form] = Form.useForm();
  //dispatch
  const dispatch = useDispatch();
  //redux-config
  const spectrumConfig = useSelector((state) => state.config.spectrumConfig);
  //useState
  //form表单的初始化数据
  useEffect(() => {
    if (Object.keys(spectrumConfig).length) {
      form.setFieldsValue(spectrumConfig);
    }
  }, []);
  //表单验证通过触发
  const onFinish = async (values) => {
    //写入redux
    dispatch(setSpectrumConfig(values));
    message.success("SUCCESS");
  };
  //表单自动保存,防止用户未点击保存
  const onValuesChange = (changedValues, allValues) => {
    dispatch(setSpectrumConfig(allValues));
  };
  const testLink = async () => {
    try {
      const ip = form.getFieldValue("ip");
      if (ip) {
        const flag = ipReg.test(ip);
        if (flag) {
          //通知main进程去处理,不在渲染进程中执行
          const rst = await ipcRenderer.invoke("testLinkIsEnabled", { ip });
          //判断连接是否可用
          message.success("连接可用");
        } else {
          message.error("请检查IP格式是否正确");
        }
      }
    } catch (error) {
      notification.error({
        message: "连接不可用,请确认设备ip是否正确",
        description: error.toString(),
      });
    }
  };
  return (
    <Card
      className="spectrum-config-wrapper"
      styles={{
        header: {
          minHeight: 36,
          lineHeight: "36px",
        },
      }}
      title="频谱配置"
      extra={
        <Button type="link" onClick={() => form.submit()}>
          {/* 保存设置 */}
          {t("saveSettings")}
        </Button>
      }
    >
      <Form
        labelWrap
        form={form}
        onFinish={onFinish}
        labelAlign="left"
        labelCol={{ flex: "140px" }}
        wrapperCol={{
          flex: 1,
        }}
        layout="horizontal"
        onValuesChange={onValuesChange}
      >
        <Form.Item
          label="IP"
          name="ip"
          rules={[
            {
              required: true,
              message: "Required!",
            },
            {
              pattern: ipReg,
              message: t("formatError"),
            },
          ]}
        >
          <Input name="ip" style={{ width: 160, marginRight: 10 }} />
        </Form.Item>
        <div style={{ marginLeft: 140, marginBottom: 10 }}>
          <Button
            color="primary "
            variant="outlined "
            onClick={testLink}
            size="small"
            icon={<ApiOutlined />}
          >
            测试连接是否可用
          </Button>
        </div>
        {/* powAtt */}
        <Form.Item
          label="POW ATT"
          name="POWATT"
          rules={[
            {
              required: true,
              message: "Required!",
            },
          ]}
        >
          <Input style={{ width: 160 }} />
        </Form.Item>
        {/* Duty Cycle */}
        <Form.Item
          label="DutyCycle(%)"
          name="dutyCycle"
          rules={[
            {
              required: true,
              message: "Required!",
            },
          ]}
        >
          <InputNumber min={0} precision={0} step={1} />
        </Form.Item>
        <Form.Item label="基站Scenario" name="Scenario">
          <Select
            style={{
              width: "90%",
            }}
            options={[
              {
                value: "BasicScheduler",
                label: "Basic Scheduler",
              },
              {
                value: "PUSCH_RMC",
                label: "PUSCH RMC (TX tests, TS 38.521)",
              },
            ]}
          />
        </Form.Item>
      </Form>
    </Card>
  );
};
export default App;
