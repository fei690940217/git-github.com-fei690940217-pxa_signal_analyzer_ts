/*
 * @FilePath: \fcc_5g_test_system_only_spectrum\src\page\addPage\formModule\index.jsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-16 15:10:47
 * @Descripttion:  form模块
 */
import {
  Button,
  Form,
  Input,
  message,
  Select,
  Card,
  Checkbox,
  Radio,
  Modal,
  notification,
  Tag,
  Table,
  Switch,
  Space,
} from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import './index.scss';
import { v4 as uuidv4 } from 'uuid';
import $moment from 'moment';
import { testItemList, LTE_BW_LIST } from './util/formData';
import { setProjectList, setCurrentRow } from '@/store/modules/projectList';
import addLog from '@/store/asyncThunk/addLog';
import { logError } from '@/utils/logLevel.js';
import modalConfirm from '@/utils/modalConfirm';
import { delayTime } from '@/utils';
import supRowsGenerate from './util/index.js';
import { cloneDeep, debounce } from 'lodash';
import BandModal from './BandModal';
import SelectBand from './selectBand';
import { useTranslation } from 'react-i18next';
import RBTableObj from '@/page/addPage/formModule/util/RBTableObj.js';

const { ipcRenderer } = window.myApi;

//设置预设名称
const App = ({
  addProjectForm,
  addFormValues,
  setAddFormValuesFn,
  selectBand,
  setSelectBand,
  RBSelectedRowKeys,
  setRBSelectedRowKeys,
}) => {
  const { t, i18n } = useTranslation('addPage');
  // const [addProjectForm] = Form.useForm();
  const [modalApi, contextHolder] = Modal.useModal();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const projectList = useSelector((state) => state.projectList.projectList);
  const currentRow = useSelector((state) => state.projectList.currentRow);
  const { networkMode } = addFormValues;
  const showLTE = networkMode === 'NSA';
  //state
  const [bandModalVisible, setBandModalVisible] = useState(false);

  const updateProjectList = async (result) => {
    try {
      await ipcRenderer.invoke('setJsonFile', {
        type: 'projectList',
        params: {
          result,
        },
      });
    } catch (error) {
      logError(error.toString());
    }
  };
  //将当前行的水存入本地json文件,备份数据用,无实际作用
  const setProjectInfoToJson = async (data) => {
    try {
      await ipcRenderer.invoke('setProjectInfoToJson', data);
    } catch (error) {
      logError(error.toString());
    }
  };
  //更新项目列表,projectList.json
  const addUpdatePorjectList = async (formValue) => {
    const { projectName, testItems, networkMode } = formValue;
    //给projectList.json中添加本项目
    let projectObj = {
      id: uuidv4(),
      createDate: $moment().format('YYYY-MM-DD HH:mm'),
      formValue,
      RBSelectedRowKeys,
      projectName,
      testItems,
      networkMode,
    };
    let newProjectList = [...projectList, projectObj];
    //更新硬盘数据
    updateProjectList(newProjectList);
    //更新内存redux中项目列表
    dispatch(setProjectList(newProjectList));
    dispatch(setCurrentRow(projectObj));
    //将当前行信息存入本地json文件,备份数据用
    setProjectInfoToJson(projectObj);
  };
  const editUpdatePorjectList = async (formValue) => {
    const tempProjectList = cloneDeep(projectList);
    const { testItems, networkMode } = formValue;
    const RST = tempProjectList.map((projectItem) => {
      if (projectItem.id === currentRow.id) {
        projectItem.formValue = formValue;
        projectItem.RBSelectedRowKeys = RBSelectedRowKeys;
        projectItem.testItems = testItems;
        projectItem.networkMode = networkMode;
        dispatch(setCurrentRow(projectItem));
        setProjectInfoToJson(projectItem);
      }
      return projectItem;
    });
    //更新硬盘数据
    updateProjectList(RST);
    //更新redux中项目列表
    dispatch(setProjectList(RST));
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
    return new Promise(async (resolve, reject) => {
      try {
        //验证且获取表单数据
        const values = await addProjectForm.validateFields();
        resolve(values);
      } catch (error) {
        reject(t('verifyFormTooltip'));
      }
    });
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
      await RBSelectedValidate(testItems);
      const isAdd = projectName !== currentRow.projectName;
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
      //
      if (isAdd) {
        //创建项目文件夹等
        await ipcRenderer.invoke('createDir', `/user/project/${projectName}`);
        //如果项目创建成功,刷新项目列表
        addUpdatePorjectList(tempFormValues);
        //添加log
        const log = `success_-_${projectName} 项目创建成功`;
        dispatch(addLog(log));
      } else {
        //刷新项目列表
        editUpdatePorjectList(tempFormValues);
        //添加log
        const log = `success_-_${projectName} 项目已修改`;
        dispatch(addLog(log));
      }
      //刷新当前行的结果表
      await ipcRenderer.invoke('setJsonFile', {
        type: 'currentResult',
        params: { projectName, result },
      });
      messageApi.success('Success');
      await delayTime(500);
      //跳转首页
      navigate('/');
    } catch (error) {
      logError(error.toString());
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
  //生成默认的RB选择项
  const defaultSelectRBList = (testItem) => {
    const allRBList = RBTableObj[testItem];
    if (testItem === 'BandEdge') {
      return allRBList
        ?.filter((item) => {
          return (
            item.OFDM === 'DFT' &&
            (item.modulate === 'BPSK' || item.modulate === 'QPSK')
          );
        })
        .map((item) => item.id);
    } else if (testItem === 'CSE') {
      return allRBList
        ?.filter((item) => {
          const flag1 = item.OFDM === 'DFT';
          const flag2 = item.modulate === 'BPSK' || item.modulate === 'QPSK';
          const flag3 = item.RB?.includes('1RB');
          return flag1 && flag2 && flag3;
        })
        .map((item) => item.id);
    } else if (testItem === 'PAR') {
      const modulateList = ['DFT-BPSK', 'DFT-256QAM', 'CP-QPSK', 'CP-256QAM'];
      return allRBList
        ?.filter((item) => {
          const flag1 = modulateList.includes(`${item.OFDM}-${item.modulate}`);
          const flag2 = item.RB?.includes('Full');
          return flag1 && flag2;
        })
        .map((item) => item.id);
    } else if (testItem === 'OBW') {
      const modulateList = [
        'DFT-BPSK',
        'DFT-QPSK',
        'DFT-16QAM',
        'DFT-64QAM',
        'DFT-256QAM',
        'CP-QPSK',
      ];
      return allRBList
        ?.filter((item) => {
          const flag1 = modulateList.includes(`${item.OFDM}-${item.modulate}`);
          return flag1;
        })
        .map((item) => item.id);
    } else {
      return [];
    }
  };
  const testItemsChange = (e) => {
    const testItems = e.target.value;
    if (testItems) {
      const idList = defaultSelectRBList(testItems);
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
