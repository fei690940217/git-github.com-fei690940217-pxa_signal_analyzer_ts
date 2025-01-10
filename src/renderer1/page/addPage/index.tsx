/*
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\index.tsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 16:19:18
 * @Descripttion:  新建项目
 */

import {
  Form,
  Button,
  message,
  notification,
  Flex,
  Avatar,
  ConfigProvider,
} from 'antd';
import { CheckOutlined, SyncOutlined, CloseOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import './index.scss';
//设置预设名称
import FormModule from './formModule';
import { useAppSelector, useAppDispatch } from '@src/renderer1/hook';
import type { BandItemInfo, ProjectItemType } from '@src/customTypes/renderer';
import type { ApiResponseType, CreateProjectPayload } from '@src/customTypes';
import { setAddFormValue } from '@src/renderer1/store';
import modalConfirm from '@src/renderer1/utils/modalConfirm';
// import { logChannel } from '@src/renderer1/utils/BroadcastChannel';
import { refreshProjectListChannel } from '@src/BroadcastChannel';

import RESULTGenerate from './util/RESULT';
import { getProjectInfo, projectInfoGen } from './util';
import { logError } from '@src/renderer1/utils/logLevel';
import { delayTime } from '@src/renderer1/utils';
import logoIcon from '@root/assets/icon.png';
import { useStyle } from './useStyle';
const { ipcRenderer } = window.myApi;
export default () => {
  const { styles } = useStyle();
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const dispatch = useAppDispatch();
  const [addProjectForm] = Form.useForm();
  const addFormValue = useAppSelector((state) => state.addFormValue);
  //LTEBandList
  const [LTEBandList, setLTEBandList] = useState<BandItemInfo[]>([]);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const [dirName, setDirName] = useState<string>('');
  const [subProjectName, setSubProjectName] = useState<string>('');
  const [projectInfo, setProjectInfo] = useState<ProjectItemType | null>(null);
  //进入页面,根据currentRow重置数据
  const initFn = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dirName = urlParams.get('dirName');
    const subProjectName = urlParams.get('subProjectName');
    if (!dirName) return;
    setDirName(dirName);
    if (subProjectName) {
      //如果项目名称不为空，说明是编辑项目，否则是新建项目
      setSubProjectName(subProjectName);
      setIsAdd(false);
    } else {
      setIsAdd(true);
    }
    console.log('projectName', dirName);
    console.log('subProjectName', subProjectName);
    //退出
    const flag = !subProjectName;
    if (flag) return;
    //编辑
    //准备获取当前行信息
    const projectInfo = await getProjectInfo({ dirName, subProjectName });
    if (!projectInfo) return;
    setProjectInfo(projectInfo);
    const { createDate, updateDate, id, ...rest } = projectInfo;
    dispatch(setAddFormValue(rest));
    addProjectForm.setFieldsValue(rest);
  };

  const getBandList = async () => {
    const LTEBandList = await ipcRenderer.invoke<BandItemInfo[]>(
      'getJsonFileByFilePath',
      'app/LTE_Band_List.json',
    );
    setLTEBandList(LTEBandList);
  };
  useEffect(() => {
    getBandList();
  }, []);
  //从后端获取RBTableObj
  useEffect(() => {
    initFn();
  }, []);
  //表单验证
  const formVerify = () => {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        //验证且获取表单数据
        const values = await addProjectForm.validateFields();
        console.log(values);
        resolve(true);
      } catch (error) {
        console.error(error);
        messageApi.warning('请检查表单是否填写完整正确');
        resolve(false);
      }
    });
  };
  //提交函数
  const submit = async () => {
    try {
      const verifyFlag = await formVerify();
      console.log(verifyFlag);
      if (!verifyFlag) return;
      //验证表单
      const { projectName } = addFormValue;
      const newIsAdd = projectName !== subProjectName;
      //判断是新增/编辑
      const confirmFlag = await modalConfirm(
        `确认${newIsAdd ? '新建' : '修改'}项目 < ${projectName} >?`,
        `项目路径 ${dirName} / ${projectName}`,
      );
      if (!confirmFlag) return;
      //生成测试数据表并更新result.json
      const result = await RESULTGenerate(addFormValue);
      //新增需要创建文件夹
      const newProjectInfo = projectInfoGen(
        newIsAdd,
        addFormValue,
        projectInfo,
      );
      // 通知后端,创建项目
      const payload: CreateProjectPayload = {
        dirName,
        subProjectName: projectName,
        isAdd: newIsAdd,
        projectInfo: newProjectInfo,
        result,
      };
      const res: ApiResponseType = await ipcRenderer.invoke(
        'ipcMainMod1Handle',
        {
          action: 'createProject',
          payload,
        },
      );
      console.log('后端已返回数据', res);
      const { code, msg } = res;
      //创建成功
      if (code === 0) {
        //1通知mainWindow更新项目列表,使用广播  //BroadcastChannelParams
        refreshProjectListChannel.postMessage('refreshProjectList');
        //2.通知mainWindow更新项目列表,使用store
        messageApi.success('项目创建成功');
        await delayTime(500);
        ipcRenderer.send('close-add-window');
      } else {
        throw new Error(msg);
      }
    } catch (error) {
      const msg = `${error?.toString()} 项目创建失败 `;
      logError(msg);
      notificationApi.error({
        message: 'Tip',
        description: String(error),
        duration: null,
      });
      return;
    }
  };
  //强制更新所有配置文件
  const refreshConfigFile = () => {
    ipcRenderer.send('refreshConfigFile');
  };
  //取消/关闭窗口
  const cancelFn = () => {
    ipcRenderer.send('close-add-window');
  };
  const clickk = () => {
    refreshProjectListChannel.postMessage('你好mianWindow,我是addWindow');
  };
  return (
    <div className="add-project-wrapper">
      {notificationContextHolder}
      {messageContextHolder}
      <div className="add-project-content">
        <div className="add-project-header">
          <Flex className="add-project-header-content" justify="space-between">
            <Flex className="header-left" align="center" gap={8}>
              <Avatar src={logoIcon} size={24} />
              <span className="title-text">
                {isAdd ? '新建项目' : '修改项目'}
              </span>
            </Flex>
            <Flex className="header-right" align="center" gap={8}>
              <Button
                onClick={refreshConfigFile}
                size="small"
                ghost
                icon={<SyncOutlined />}
              >
                更新配置文件
              </Button>
              <Button
                onClick={clickk}
                size="small"
                ghost
                icon={<SyncOutlined />}
              >
                测试按钮
              </Button>
            </Flex>
          </Flex>
        </div>
        <div className="add-project-body">
          {/* 新增表单 */}
          <FormModule
            addProjectForm={addProjectForm}
            LTEBandList={LTEBandList}
          />
        </div>
        <div className="add-project-footer">
          <Flex
            gap={40}
            justify="center"
            align="center"
            className="add-project-footer-content"
          >
            <Button
              size="small"
              icon={<CloseOutlined />}
              ghost
              onClick={cancelFn}
            >
              取 消
            </Button>
            <ConfigProvider
              button={{
                className: styles.linearGradientButton,
              }}
            >
              <Button
                size="small"
                type="primary"
                onClick={submit}
                icon={<CheckOutlined />}
              >
                提 交
              </Button>
            </ConfigProvider>
          </Flex>
        </div>
      </div>
    </div>
  );
};
