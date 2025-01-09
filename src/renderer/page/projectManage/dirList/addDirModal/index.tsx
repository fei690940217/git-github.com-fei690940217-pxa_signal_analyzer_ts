/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-08 11:24:50
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
import { AddDirType, IpcRendererInvokeResType } from '@src/customTypes/index';
import { logError } from '@/utils/logLevel';

const { TextArea } = Input;
const { ipcRenderer } = window.myApi;

type PropsType = {
  modalVisible: boolean | undefined;
  closeModal: () => void;
  isAdd: boolean;
  refreshDirList: () => void;
  currentDir: AddDirType | null;
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
  currentDir,
}: PropsType) => {
  const [addProjectForm] = Form.useForm();

  const [addFormValue, setAddFormValue] = useState<FormValueType | null>(null);
  //本弹窗内的选择项
  //弹窗打开事件
  const dialogOpen = () => {
    try {
      console.log('弹窗打开了', isAdd, currentDir);
      //新增
      if (isAdd) {
        const deepFormValue = cloneDeep(initFormValue);
        setAddFormValue(deepFormValue);
      }
      //编辑
      else {
        console.log('进入编辑模式');
        if (currentDir) {
          console.log('进入编辑模式内部');
          const { dirName, description } = currentDir;
          const obj = { dirName, description };
          console.log(obj);
          setAddFormValue(obj);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (modalVisible) {
      dialogOpen();
    }
  }, [modalVisible]);
  const dirNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const dirName = e.target.value || '';
    console.log('dirNameChange', e.target.value);
    const tempDescription = addFormValue?.description || '';
    setAddFormValue({ description: tempDescription, dirName });
  };
  const descriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const tempDescription = e.target.value || '';
    const dirName = addFormValue?.dirName || '';
    console.log('descriptionChange', e.target.value);

    setAddFormValue({ description: tempDescription, dirName });
  };

  const addSubmit = async () => {
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
      const res = await ipcRenderer.invoke<IpcRendererInvokeResType>(
        'add-dir',
        dirInfo,
      );
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
  const editSubmit = async () => {
    try {
      const formValue = await addProjectForm.validateFields();
      console.log(formValue);
      const { dirName, description } = formValue;
      if (!dirName) return;
      if (!currentDir?.id) return;
      //通知后端创建文件夹,写入文件夹信息
      const { id, createdAt } = currentDir;
      const dirInfo: AddDirType = {
        id,
        dirName,
        description,
        createdAt,
      };
      const paylaod = {
        newDirInfo: dirInfo,
        oldDirInfo: currentDir,
      };
      const res = await ipcRenderer.invoke<IpcRendererInvokeResType>(
        'edit-dir',
        paylaod,
      );
      // 成功
      if (res.code === 0) {
        closeModal();
        refreshDirList();
        return message.success('目录已修改');
      } else {
        return message.error(res?.msg);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const submit = () => {
    if (isAdd) {
      addSubmit();
    } else {
      editSubmit();
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
      destroyOnClose
    >
      <Form
        size="small"
        form={addProjectForm}
        layout="horizontal"
        labelCol={{ flex: '120px' }}
        wrapperCol={{ flex: 'auto' }}
        labelAlign="right"
        clearOnDestroy
        initialValues={addFormValue || { dirName: '', description: '' }}
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
