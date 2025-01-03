/*
 * @FilePath: \pxa_signal_analyzer\src\renderer1\page\addPage\index.tsx
 * @Author: xxx
 * @Date: 2023-03-21 17:18:10
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-03 17:45:46
 * @Descripttion:  新建项目
 */

import { Card, Form, Button, message, notification, Flex } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import { type Key } from 'react';
import './index.scss';
//设置预设名称
import FormModule from './formModule';
import localforage from 'localforage';
import { useAppSelector, useAppDispatch } from '@src/renderer/hook';
import {
  BandItemInfo,
  NewAddFormValueType,
  ProjectItemType,
} from '@src/customTypes/renderer';
import { setAddFormValue } from '@src/renderer/store/modules/projectList';
import { cloneDeep } from 'lodash';
import modalConfirm from '@src/renderer/utils/modalConfirm';
import RESULTGenerate from './util/RESULT';
import { logError } from '@src/renderer/utils/logLevel';
import { nanoid } from 'nanoid';
import $moment from 'moment';
import { delayTime } from '@src/renderer/utils';
import addLog from '@src/renderer/store/asyncThunk/addLog';

const { ipcRenderer } = window.myApi;
export default () => {
  const [notificationApi, notificationContextHolder] =
    notification.useNotification();
  const dispatch = useAppDispatch();
  const [addProjectForm] = Form.useForm();
  const currentRow = useAppSelector((state) => state.projectList.currentRow);
  const addFormValue = useAppSelector(
    (state) => state.projectList.addFormValue,
  );
  //LTEBandList
  const [LTEBandList, setLTEBandList] = useState<BandItemInfo[]>([]);
  const [isAdd, setIsAdd] = useState<boolean>(true);
  const title = isAdd ? '新建项目' : '编辑项目';
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const projectName = urlParams.get('projectName');
    const subProjectName = urlParams.get('subProjectName');
    //如果项目名称不为空，说明是编辑项目，否则是新建项目
    if (subProjectName) {
      setIsAdd(false);
    }
    console.log('projectName', projectName);
    console.log('subProjectName', subProjectName);
  }, []);
  //进入页面,根据currentRow重置数据
  const initFn = async () => {
    //说明是首页点击复用按钮进入的此页面
    if (currentRow?.id) {
      const { formValue } = currentRow;
      dispatch(setAddFormValue(formValue));
    }
    //其他情况
    else {
      const tempAddFormValues: NewAddFormValueType | null =
        await localforage.getItem('addFormValue');
      if (tempAddFormValues) {
        dispatch(setAddFormValue(tempAddFormValues));
      }
    }
  };

  const getBandList = async () => {
    const LTEBandList = await ipcRenderer.invoke(
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
    return new Promise<void>(async (resolve, reject) => {
      try {
        //验证且获取表单数据
        const values = await addProjectForm.validateFields();
        console.log(values);
        resolve();
      } catch (error) {
        reject(new Error('请检查表单填写是否完整'));
      }
    });
  };
  //生成新的当前行数据
  const newCurrentRowHandle = (
    isAdd: boolean,
    formValue: NewAddFormValueType,
  ) => {
    const { projectName, testItems, networkMode, RBConfigSelected } = formValue;
    if (isAdd) {
      //给projectList.json中添加本项目
      const projectObj = {
        id: nanoid(8),
        createDate: $moment().format('YYYY-MM-DD HH:mm'),
        formValue,
        RBConfigSelected,
        projectName,
        testItems,
        networkMode,
      };
      return projectObj;
    } else {
      if (!currentRow?.id) return currentRow;
      const tempCurrentRow = cloneDeep(currentRow);
      tempCurrentRow.formValue = formValue;
      tempCurrentRow.RBConfigSelected = RBConfigSelected;
      tempCurrentRow.testItems = testItems;
      tempCurrentRow.networkMode = networkMode;
      return tempCurrentRow;
    }
  };
  //将当前行的数据存入本地json文件,备份数据用,无实际作用
  const setProjectInfoToJson = async (data: ProjectItemType) => {
    try {
      await ipcRenderer.invoke('setProjectInfoToJson', data);
    } catch (error) {
      const msg = `${error?.toString()} 项目信息写入失败 `;
      logError(msg);
    }
  };
  //提交函数
  const submit = async () => {
    try {
      await formVerify();
      //验证表单
      const { projectName } = addFormValue;
      const isAdd = projectName !== currentRow?.projectName;
      //判断是新增/编辑
      if (isAdd) {
        await modalConfirm(`确认新建项目 < ${projectName} >?`, '');
      } else {
        await modalConfirm(
          `确认修改项目 < ${projectName} > ?`,
          '如果是新建项目请修改项目名称后重试',
        );
      }
      //生成测试数据表并更新result.json
      const result = await RESULTGenerate(addFormValue);
      //新增需要创建文件夹
      if (isAdd) {
        await ipcRenderer.invoke('createDir', `/user/project/${projectName}`);
      }
      const newCurrentRow = newCurrentRowHandle(isAdd, addFormValue);
      if (newCurrentRow?.id) {
        //更新本地数据库
        setProjectInfoToJson(newCurrentRow);
        // 写入/刷新 当前行的结果表
        await ipcRenderer.invoke('setJsonFile', {
          type: 'currentResult',
          params: { projectName, result },
        });
        message.success('Success');
        await delayTime(500);
        //添加log
        const log = `success_-_${projectName} 项目已修改`;
        dispatch(addLog(log));
      }
    } catch (error) {
      const msg = `${error?.toString()} 项目创建失败 `;
      logError(msg);
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
  return (
    <div className="add-project-wrapper">
      {notificationContextHolder}
      <div className="add-project-content">
        <div className="add-project-header">
          <Flex>
            <div>{title}</div>
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
          <Flex gap={20} justify="center">
            <Button size="small" type="primary" ghost onClick={submit}>
              取 消
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={submit}
              icon={<CheckOutlined />}
            >
              提 交
            </Button>
          </Flex>
        </div>
      </div>
    </div>
  );
};
