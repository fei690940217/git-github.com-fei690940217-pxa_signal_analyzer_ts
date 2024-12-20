/*
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\formModule\index.tsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-20 09:59:14
 * @Descripttion:  form模块
 */
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Card,
  Radio,
  Modal,
  notification,
  Switch,
  Space,
} from 'antd';
import type { RadioChangeEvent } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { type Key } from 'react';

import { useNavigate } from 'react-router';
import './index.scss';
import { nanoid } from 'nanoid';
import $moment from 'moment';
import { LTE_BW_LIST } from './util/formData';
import { testItemList } from '@src/common';
import addLog from '@/store/asyncThunk/addLog';
import { logError } from '@/utils/logLevel';
import modalConfirm from '@/utils/modalConfirm';
import { delayTime } from '@/utils';
import supRowsGenerate from './util';
import { cloneDeep, debounce } from 'lodash';
import BandModal from './BandModal';
import SelectBand from './selectBand';
import { useTranslation } from 'react-i18next';
import { generateDefaultSelectRBList } from '@src/renderer/page/addPage/formModule/util/RBTableObj';
import {
  BandItemInfo,
  AddFormValueType,
  ProjectItemType,
} from '@src/customTypes/renderer';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';

const { ipcRenderer } = window.myApi;
type Props = {
  addProjectForm: any;
  addFormValues: AddFormValueType | null;
  setAddFormValuesFn: Function;
  selectBand: BandItemInfo[];
  setSelectBand: Function;
  RBSelectedRowKeys: Key[];
  setRBSelectedRowKeys: (val: Key[]) => void;
};
//设置预设名称
const App = ({
  addProjectForm,
  addFormValues,
  setAddFormValuesFn,
  selectBand,
  setSelectBand,
  RBSelectedRowKeys,
  setRBSelectedRowKeys,
}: Props) => {
  const { t, i18n } = useTranslation('addPage');
  // const [addProjectForm] = Form.useForm();
  const [modalApi, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentRow = useAppSelector((state) => state.projectList.currentRow);
  const networkMode = addFormValues?.networkMode;
  const showLTE = networkMode === 'NSA';
  //state
  const [bandModalVisible, setBandModalVisible] = useState(false);

  //将当前行的水存入本地json文件,备份数据用,无实际作用
  const setProjectInfoToJson = async (data: ProjectItemType) => {
    try {
      await ipcRenderer.invoke('setProjectInfoToJson', data);
    } catch (error) {
      logError(error?.toString());
    }
  };
  //RB选中行验证
  const RBSelectedValidate = () => {
    try {
      if (!RBSelectedRowKeys?.length) {
        return Promise.reject(`请勾选RB配置`);
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(t('inspectRBConfig'));
    }
  };

  //表单验证
  const formVerify = () => {
    return new Promise<AddFormValueType>(async (resolve, reject) => {
      try {
        //验证且获取表单数据
        const values = await addProjectForm.validateFields();
        resolve(values);
      } catch (error) {
        reject(t('verifyFormTooltip'));
      }
    });
  };
  //生成新的当前行数据
  const newCurrentRowHandle = (isAdd: boolean, formValue: AddFormValueType) => {
    const { projectName, testItems, networkMode } = formValue;
    if (isAdd) {
      //给projectList.json中添加本项目
      const projectObj = {
        id: nanoid(8),
        createDate: $moment().format('YYYY-MM-DD HH:mm'),
        formValue,
        RBSelectedRowKeys,
        projectName,
        testItems,
        networkMode,
      };
      return projectObj;
    } else {
      if (!currentRow?.id) return currentRow;
      const tempCurrentRow = cloneDeep(currentRow);
      tempCurrentRow.formValue = formValue;
      tempCurrentRow.RBSelectedRowKeys = RBSelectedRowKeys;
      tempCurrentRow.testItems = testItems;
      tempCurrentRow.networkMode = networkMode;
      return tempCurrentRow;
    }
  };
  //提交函数
  const submit = async () => {
    try {
      //验证表单
      const values = await formVerify();
      const tempFormValues = cloneDeep(values);
      tempFormValues.Band = selectBand;
      const { projectName, testItems, networkMode } = tempFormValues;
      //判断是否有选中行
      await RBSelectedValidate();
      const isAdd = projectName !== currentRow?.projectName;
      //判断是新增/编辑
      if (isAdd) {
        await modalConfirm(`${t('confirmNewProject')} < ${projectName} >?`);
      } else {
        await modalConfirm(
          `${t('confirmModifyingProject')} < ${projectName} > ?`,
          t('modifyOldProjectTooltip'),
        );
      }
      //生成测试数据表并更新result.json
      const result = await supRowsGenerate(tempFormValues, RBSelectedRowKeys);
      //新增需要创建文件夹
      if (isAdd) {
        await ipcRenderer.invoke('createDir', `/user/project/${projectName}`);
      }
      const newCurrentRow = newCurrentRowHandle(isAdd, tempFormValues);
      if (newCurrentRow?.id) {
        //更新本地数据库
        setProjectInfoToJson(newCurrentRow);
        // 写入/刷新 当前行的结果表
        await ipcRenderer.invoke('setJsonFile', {
          type: 'currentResult',
          params: { projectName, result },
        });
        messageApi.success('Success');
        await delayTime(500);
        //添加log
        const log = `success_-_${projectName} 项目已修改`;
        dispatch(addLog(log));
        //跳转首页
        // navigate('/');
        navigate('/', {
          state: { form: 'addPage', projectId: newCurrentRow.id },
        });
      }
    } catch (error) {
      logError(error?.toString());
      if (error !== '取消') {
        notificationApi.error({
          message: 'Tip',
          description: String(error),
          duration: null,
        });
        return;
      }
    }
  };
  //表单数据变化后重新生成结果供用户选择
  const valuesChange = debounce(async (changedValues, allValues) => {
    //存储表单数据
    setAddFormValuesFn(allValues);
  }, 500);
  const BandValidator = async () => {
    try {
      if (selectBand?.length) {
        //NSA
        for (let BandObj of selectBand) {
          const { Band, SCS, BW, ARFCN, LTE_Band } = BandObj;
          //NSA
          if (showLTE) {
            if (!LTE_Band?.length) {
              return Promise.reject(`${Band}未选择对应的LTE_Band`);
            }
          }
          if (!SCS?.length) {
            return Promise.reject(`${Band}未选择SCS`);
          }
          if (!BW?.length) {
            return Promise.reject(`${Band}未选择BW`);
          }
          if (!ARFCN?.length) {
            return Promise.reject(`${Band}未选择ARFCN`);
          }
        }
        return Promise.resolve();
      } else {
        return Promise.reject('未选择NR_Band');
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const testItemsChange = (e: RadioChangeEvent) => {
    const testItems = e.target.value;
    if (testItems) {
      const idList = generateDefaultSelectRBList(testItems);
      setRBSelectedRowKeys(idList);
    } else {
      setRBSelectedRowKeys([]);
    }
  };
  return (
    <Card
      className="add-project-form-card"
      styles={{
        header: {
          minHeight: 36,
          padding: '0 12px',
        },
        body: {
          padding: '8px',
        },
      }}
    >
      {contextHolder}
      {messageContextHolder}
      {notificationContextHolder}
      <BandModal
        modalVisible={bandModalVisible}
        closeModal={() => setBandModalVisible(false)}
        selectBand={selectBand}
        setSelectBand={setSelectBand}
        showLTE={showLTE}
      ></BandModal>

      {/* <HeaderModule /> */}
      <div className="add-form-wrapper">
        <Form
          size="small"
          form={addProjectForm}
          layout="horizontal"
          onValuesChange={valuesChange}
          labelCol={{ flex: '80px' }}
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
                message: 'required !',
              },
              {
                pattern: /^[^/\\\\:\\*\\?\\<\\>\\|\"]{1,255}$/,
                message: `${t('projectNameRuleTooltip')}  ?/|*:<> `,
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* 测试用例 */}
          <Form.Item
            label={t('testItem')}
            name="testItems"
            rules={[
              {
                required: true,
                message: 'required!',
              },
              {
                validator: async (_, value) => {
                  if (Boolean(value.length)) {
                    return Promise.resolve();
                  } else {
                    return Promise.reject(new Error('required !'));
                  }
                },
              },
            ]}
          >
            <Radio.Group onChange={testItemsChange}>
              <Space direction="vertical">
                {testItemList.map((item) => {
                  return (
                    <Radio key={item.value} value={item.value}>
                      {item.label}
                    </Radio>
                  );
                })}
              </Space>
            </Radio.Group>
          </Form.Item>
          {/* Gate */}
          <Form.Item
            valuePropName="checked"
            name="isGate"
            label="Gate"
            extra={
              <div
                style={{ fontSize: 12, color: '#F56C6C' }}
              >{`(建议CSE底噪高于限值或bandedge测试fail时开启)`}</div>
            }
          >
            <Switch checkedChildren="开启" unCheckedChildren="关闭" />
          </Form.Item>
          {/* 组网模式 */}
          <Form.Item
            initialValue="SA"
            label={t('networkMode')}
            name="networkMode"
            rules={[
              {
                required: true,
                message: 'required!',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={'SA'}>SA</Radio>
              <Radio value={'NSA'}>NSA</Radio>
            </Radio.Group>
          </Form.Item>
          {/* band 频段 */}
          <Form.Item
            label="Band"
            name="Band"
            required
            rules={[
              {
                validator: BandValidator,
              },
            ]}
          >
            <Button
              type="primary"
              ghost
              onClick={() => setBandModalVisible(true)}
              icon={<PlusOutlined />}
            >
              Band
            </Button>
          </Form.Item>
          {/* 用户选中的Band表 */}
          <SelectBand selectBand={selectBand} showLTE={showLTE}></SelectBand>
          {/* LTE-BW */}
          {showLTE && (
            <Form.Item
              label="LTE_BW"
              name="LTE_BW"
              rules={[
                {
                  required: true,
                  message: 'Select LTE-BW!',
                },
              ]}
            >
              <Select placeholder="Select LTE-BW" options={LTE_BW_LIST} />
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
                  message: 'place Select LTE-ARFCN!',
                },
              ]}
            >
              <Radio.Group>
                <Radio value={0}>Low</Radio>
                <Radio value={1}>Mid</Radio>
                <Radio value={2}>High</Radio>
              </Radio.Group>
            </Form.Item>
          )}
        </Form>
      </div>
      <div>
        <Button
          icon={<PlusOutlined />}
          type="primary"
          ghost
          block
          size="small"
          onClick={submit}
        >
          {t('createProject')}
        </Button>
      </div>
    </Card>
  );
};
export default App;
