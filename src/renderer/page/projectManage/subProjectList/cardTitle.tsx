/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-09 16:40:31
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\projectManage\subProjectList\cardTitle.tsx
 * @Description: 项目列表主表格
 */

import { Button, message, Flex, Tooltip } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteTwoTone,
  HddTwoTone,
  ReloadOutlined,
} from '@ant-design/icons';
import React from 'react';
import './index.scss';
import { logError } from '@/utils/logLevel';
import { ProjectItemType } from '@src/customTypes/renderer';
import { AddDirType, OpenTheProjectWindowPayload } from '@src/customTypes';
import modalConfirm from '@src/renderer/utils/modalConfirm';

const { ipcRenderer } = window.myApi;
type PropsType = {
  currentDir: AddDirType | null;
  getSubProjectList: () => Promise<void>;
  selectSubProject: ProjectItemType[];
  setSelectSubProject: React.Dispatch<React.SetStateAction<ProjectItemType[]>>;
};
export default ({
  currentDir,
  getSubProjectList,
  selectSubProject,
  setSelectSubProject,
}: PropsType) => {
  const [messageApi, messageContextHolder] = message.useMessage();

  const addFn = () => {
    if (currentDir?.dirName) {
      const payload: OpenTheProjectWindowPayload = {
        dirName: currentDir.dirName,
      };
      ipcRenderer.send('openTheProjectWindow', payload);
    } else {
      messageApi.error({
        duration: 5,
        content: '请选择一个目录',
      });
    }
  };
  const editFn = () => {
    if (selectSubProject?.length) {
      if (selectSubProject.length === 1 && currentDir) {
        const payload: OpenTheProjectWindowPayload = {
          dirName: currentDir.dirName,
          subProjectName: selectSubProject[0].projectName,
        };
        ipcRenderer.send('openTheProjectWindow', payload);
      } else {
        messageApi.warning({
          duration: 5,
          content: '只能选择一个项目',
        });
      }
    } else {
      messageApi.warning({
        duration: 5,
        content: '请选择一个项目操作',
      });
    }
  };
  //归档
  const archiveFn = async () => {
    if (currentDir?.id) {
      try {
        await modalConfirm(`确认归档 < ${currentDir.dirName} > ?`, '');
        await ipcRenderer.invoke('archiveDir', currentDir.dirName);
        //更新项目列表
        getSubProjectList();
        //清除选中行
        setSelectSubProject([]);
        messageApi.success({
          duration: 5,
          content: '已归档',
        });
      } catch (error) {
        logError(error?.toString());
        if (error !== '取消') {
          messageApi.error({
            duration: 5,
            content: String(error),
          });
        }
      }
    } else {
      messageApi.warning({
        duration: 5,
        content: '请选择一个目录操作',
      });
    }
  };
  const deleteFn = () => {};
  return (
    <Flex gap={20}>
      {messageContextHolder}
      <h2 className="card-title-text">项目管理</h2>
      <Flex gap={8} align="center">
        <Button
          color="primary"
          icon={<PlusOutlined />}
          variant="solid"
          size="small"
          onClick={addFn}
        >
          新增
        </Button>
        {/* 归档 */}
        <Button
          color="primary"
          icon={<EditOutlined />}
          variant="solid"
          size="small"
          onClick={editFn}
        >
          编辑
        </Button>
        {/* 归档 */}
        <Button
          color="primary"
          icon={<HddTwoTone />}
          variant="outlined"
          onClick={archiveFn}
          size="small"
        >
          归档
        </Button>
        <Button
          variant="outlined"
          color="danger"
          icon={<DeleteTwoTone twoToneColor="red" />}
          size="small"
          onClick={deleteFn}
        >
          删除
        </Button>
        <Tooltip title="刷新列表">
          <Button
            variant="outlined"
            icon={<ReloadOutlined />}
            size="small"
            onClick={deleteFn}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
