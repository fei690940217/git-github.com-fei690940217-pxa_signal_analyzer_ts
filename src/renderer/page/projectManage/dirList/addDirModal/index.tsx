/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-02 14:08:23
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\projectManage\dirList\addDirModal\index.tsx
 * @Description: 项目列表主表格
 */

import { Form, Input, Modal, message } from 'antd';
import { useState, useEffect } from 'react';
import { type Key, ChangeEvent } from 'react';
import Moment from 'moment';
import './index.scss';
import { cloneDeep } from 'lodash';
import { nanoid } from 'nanoid';
import { AddDirType } from '@src/customTypes/index';
import { logError } from '@/utils/logLevel';

const { TextArea } = Input;
const { ipcRenderer } = window.myApi;

type PropsType = {
  modalVisible: boolean | undefined;
  closeModal: () => void;
  isAdd: boolean;
  refreshDirList: () => void;
};
type FormValueType = {
  dirName: string;
  description: string;
};
const initFormValue = {
  dirName: '',
  description: '',
};
export default ({
  modalVisible,
  closeModal,
  isAdd,
  refreshDirList,
}: PropsType) => {
  const [addProjectForm] = Form.useForm();
  const deepFormValue = cloneDeep(initFormValue);
  const [addFormValue, setAddFormValue] =
    useState<FormValueType>(deepFormValue);
  //本弹窗内的选择项
  //弹窗打开事件
  const dialogOpen = async () => {
    try {
    } catch (error) {}
  };
  useEffect(() => {
    if (modalVisible) {
      dialogOpen();
    }
  }, [modalVisible]);
  const dirNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dirName = e.target.value;
    setAddFormValue({ ...addFormValue, dirName });
  };
  const descriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    setAddFormValue({ ...addFormValue, description });
  };
  const submit = async () => {
    try {
      const formValue = await addProjectForm.validateFields();
      console.log(formValue);
      const { dirName, description } = formValue;
      if (!dirName) return;
      //通知后端创建文件夹,写入文件夹信息
      const dirInfo: AddDirType = {
        id: nanoid(),
        dirName,
        description,
        createdAt: Moment().format('YYYY-MM-DD HH:mm:ss'),
      };
      const res = await ipcRenderer.invoke('add-dir', dirInfo);
      //成功
      if (res.code === 0) {
        closeModal();
        refreshDirList();
        return message.success('添加成功');
      } else {
        return message.error(res?.msg);
      }
    } catch (error) {
      const errorMsg = `${error?.toString()} 目录创建失败`;
      logError(errorMsg);
      return message.error(errorMsg);
    }
  };
  return (
    <Modal
      title={isAdd ? '新增目录' : '编辑目录'}
      open={modalVisible}
      onCancel={closeModal}
      onOk={submit}
      style={{ maxHeight: '90vh' }}
      centered={true}
      wrapClassName="add-edit-dir-modal-wrapper"
      width={500}
      okText="提 交"
      cancelText="取 消"
      maskClosable={false}
    >
      <Form
        size="small"
        form={addProjectForm}
        layout="horizontal"
        labelCol={{ flex: '120px' }}
        wrapperCol={{ flex: 'auto' }}
        labelAlign="right"
      >
        {/* 项目名称 */}
        <Form.Item
          label="文件夹名称"
          name="dirName"
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
          <Input value={addFormValue?.dirName} onChange={dirNameChange} />
        </Form.Item>

        {/* 测试用例 */}
        <Form.Item label="简介" name="description">
          <TextArea
            placeholder="请输入简介(选填)"
            autoSize={{ minRows: 2, maxRows: 10 }}
            value={addFormValue?.description}
            onChange={descriptionChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
