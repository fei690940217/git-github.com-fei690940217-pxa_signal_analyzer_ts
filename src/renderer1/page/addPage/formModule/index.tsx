/*
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\formModule\index.tsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 10:12:20
 * @Descripttion:  form模块
 */
import { Form, Input, Select, Radio, Switch, Space } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { type Key, ChangeEvent, useEffect, useState } from 'react';
import './index.scss';
import { testItemList } from '@src/common';
import SelectBand from './BandModal';
import RBConfigTable from './RBPlanTable';
import { useTranslation } from 'react-i18next';
import { generateDefaultSelectRBList } from '@src/renderer1/page/addPage/util';
import { useAppSelector, useAppDispatch } from '@src/renderer1/hook';
import { setAddFormValue } from '@src/renderer1/store';
import { RBConfigValidator, BandValidator } from './validator';
import { RBObjType } from '@src/customTypes/renderer';
const { ipcRenderer } = window.myApi;

const LTE_BW_LIST = [
  { label: 1.4, value: 1.4 },
  { label: 3, value: 3 },
  { label: 5, value: 5 },
  { label: 10, value: 10 },
  { label: 15, value: 15 },
  { label: 20, value: 20 },
];
type Props = {
  addProjectForm: any;
  LTEBandList: any[];
};
//设置预设名称
const App = ({ addProjectForm, LTEBandList }: Props) => {
  const { t } = useTranslation('addPage');
  const dispatch = useAppDispatch();
  const addFormValue = useAppSelector((state) => state.addFormValue);
  const [RBTableObj, setRBTableObj] = useState<RBObjType | null>(null);

  const showLTE = addFormValue?.networkMode === 'NSA';
  const RBTableList = RBTableObj?.[addFormValue?.testItems] || [];
  //获取FCC Band列表
  const getRBTableObj = async () => {
    try {
      const allRBObj: RBObjType = await ipcRenderer.invoke<RBObjType>(
        'getJsonFileByFilePath',
        'app/RBConfigSelectedList.json',
      );
      setRBTableObj(allRBObj);
    } catch (error) {
      console.error(error);
      setRBTableObj(null);
    }
  };
  useEffect(() => {
    getRBTableObj();
  }, []);
  const testItemsChange = (e: RadioChangeEvent) => {
    const testItems = e.target.value;
    if (testItems) {
      const idList = generateDefaultSelectRBList(testItems, RBTableList);
      dispatch(
        setAddFormValue({
          ...addFormValue,
          RBConfigSelected: idList,
          testItems,
        }),
      );
      //修改组件维护的数据
      addProjectForm.setFieldValue('RBConfigSelected', idList);
    } else {
      dispatch(
        setAddFormValue({
          ...addFormValue,
          RBConfigSelected: [],
          testItems: '',
        }),
      );
      //修改组件维护的数据
      addProjectForm.setFieldValue('RBConfigSelected', []);
    }
  };
  const projectNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const projectName = e.target.value;
    dispatch(setAddFormValue({ ...addFormValue, projectName }));
  };
  const isGateChange = (checked: boolean) => {
    dispatch(setAddFormValue({ ...addFormValue, isGate: checked }));
  };
  const networkModeChange = (e: RadioChangeEvent) => {
    const networkMode = e.target.value;
    if (networkMode) {
      dispatch(
        setAddFormValue({
          ...addFormValue,
          networkMode,
        }),
      );
    }
  };
  const LTE_ARFCN_Change = (e: RadioChangeEvent) => {
    const LTE_ARFCN = e.target.value;
    dispatch(
      setAddFormValue({
        ...addFormValue,
        LTE_ARFCN,
      }),
    );
  };
  const LTE_BW_Change = (value: number) => {
    dispatch(
      setAddFormValue({
        ...addFormValue,
        LTE_BW: value,
      }),
    );
  };
  return (
    <div className="add-project-form-top">
      {/* <HeaderModule /> */}
      <div className="add-form-wrapper">
        <Form
          size="small"
          form={addProjectForm}
          layout="horizontal"
          labelCol={{ flex: '100px' }}
          wrapperCol={{ flex: 'auto' }}
          labelAlign="left"
        >
          {/* 项目名称 */}
          <Form.Item
            label={t('projectName')}
            name="projectName"
            rules={[
              {
                required: true,
                type: 'string',
                message: '不能为空!',
              },
              {
                pattern: /^[^/\\\\:\\*\\?\\<\\>\\|\"]{1,255}$/,
                message: `不能包含   ?/|*:<> `,
              },
            ]}
          >
            <Input
              style={{ width: '60%' }}
              value={addFormValue?.projectName}
              onChange={projectNameChange}
            />
          </Form.Item>

          {/* 测试用例 */}
          <Form.Item
            initialValue="PAR"
            label={t('testItem')}
            name="testItems"
            rules={[
              {
                required: true,
                message: '不能为空!',
              },
            ]}
          >
            <Radio.Group
              value={addFormValue?.testItems}
              onChange={testItemsChange}
              options={testItemList}
            ></Radio.Group>
          </Form.Item>
          <Form.Item label="Gate" required>
            <Space align="baseline">
              <Form.Item name="isGate" noStyle>
                <Switch
                  onChange={isGateChange}
                  value={addFormValue?.isGate}
                  checkedChildren="开启"
                  unCheckedChildren="关闭"
                />
              </Form.Item>
              <div
                style={{ fontSize: 12, color: '#faad14' }}
              >{`(建议CSE底噪高于限值或bandedge测试fail时开启)`}</div>
            </Space>
          </Form.Item>
          {/* 组网模式 */}
          <Form.Item
            initialValue="SA"
            label={t('networkMode')}
            name="networkMode"
            rules={[
              {
                required: true,
                message: '必选项!',
              },
            ]}
          >
            <Radio.Group
              value={addFormValue?.networkMode}
              onChange={networkModeChange}
            >
              <Radio value={'SA'}>SA</Radio>
              <Radio value={'NSA'}>NSA</Radio>
            </Radio.Group>
          </Form.Item>
          {/* band 频段 */}
          <Form.Item
            label="Band"
            name="selectBand"
            required
            validateDebounce={1000}
            validateTrigger="onChange"
            rules={[BandValidator]}
            className="select-band-form-item"
          >
            <SelectBand showLTE={showLTE} LTEBandList={LTEBandList} />
          </Form.Item>

          {/* LTE-BW */}
          {showLTE && (
            <Form.Item
              label="LTE_BW"
              name="LTE_BW"
              rules={[
                {
                  required: true,
                  message: 'Place Select LTE-BW!',
                },
              ]}
            >
              <Select
                value={addFormValue?.LTE_BW}
                onChange={LTE_BW_Change}
                style={{ width: 200 }}
                placeholder="Select LTE-BW"
                options={LTE_BW_LIST}
              />
            </Form.Item>
          )}

          {/* LTE-ARFCN */}
          {showLTE && (
            <Form.Item
              name="LTE_ARFCN"
              label="LTE_ARFCN"
              rules={[
                {
                  required: true,
                  message: 'Place Select LTE-ARFCN!',
                },
              ]}
            >
              <Radio.Group
                value={addFormValue?.LTE_ARFCN}
                onChange={LTE_ARFCN_Change}
              >
                <Radio value={0}>Low</Radio>
                <Radio value={1}>Mid</Radio>
                <Radio value={2}>High</Radio>
              </Radio.Group>
            </Form.Item>
          )}
          {/* RBConfig */}
          <Form.Item
            label="RBConfig"
            required
            name="RBConfigSelected"
            validateTrigger="onChange"
            rules={[
              {
                validator: RBConfigValidator,
              },
            ]}
            className="select-band-form-item"
          >
            <RBConfigTable RBTableList={RBTableList} />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default App;
