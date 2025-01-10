/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-10 13:40:50
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
import {
  AddDirType,
  OpenTheProjectWindowPayload,
  ArchiveProjectPayload,
  ApiResponseType,
} from '@src/customTypes';
import modalConfirm from '@src/renderer1/utils/modalConfirm';

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
    if (selectSubProject?.length && currentDir?.dirName) {
      try {
        const projectNameStr = selectSubProject
          .map((item) => item.projectName)
          .join(', ');
        const confirmFlag = await modalConfirm(
          `确认归档  ?`,
          `归档项目: ${projectNameStr} `,
        );
        if (!confirmFlag) return;
        const subProjectNameList = selectSubProject.map(
          (item) => item.projectName,
        );
        const payload: ArchiveProjectPayload = {
          dirName: currentDir.dirName,
          subProjectNameList,
        };
        const res = await ipcRenderer.invoke<ApiResponseType<any>>(
          'ipcMainMod1Handle',
          {
            action: 'archiveProject',
            payload,
          },
        );
        const { code, data } = res;
        console.log(data);
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
        content: '请选择要归档的操作,允许多选',
      });
    }
  };
  const deleteFn = async () => {
    if (selectSubProject?.length && currentDir?.dirName) {
      try {
        const projectNameStr = selectSubProject
          .map((item) => item.projectName)
          .join(', ');
        const confirmFlag = await modalConfirm(
          `确认删除项目: < ${projectNameStr} > ?`,
          '请谨慎操作! 删除后不可恢复!',
        );
        if (!confirmFlag) return;
        const subProjectNameList = selectSubProject.map(
          (item) => item.projectName,
        );
        const payload: ArchiveProjectPayload = {
          dirName: currentDir.dirName,
          subProjectNameList,
        };
        const res = await ipcRenderer.invoke<ApiResponseType<any>>(
          'ipcMainMod1Handle',
          {
            action: 'deleteProject',
            payload,
          },
        );
        const { code, data } = res;
        console.log(data);
        //更新项目列表
        getSubProjectList();
        //清除选中行
        setSelectSubProject([]);
        messageApi.success({
          duration: 5,
          content: '已删除',
        });
      } catch (error) {
        logError(error?.toString());
        messageApi.error({
          duration: 5,
          content: String(error),
        });
      }
    } else {
      messageApi.warning({
        duration: 5,
        content: '请选择要归档的操作,允许多选',
      });
    }
  };
  const refreshFn = () => {
    if (currentDir?.dirName) {
      getSubProjectList();
    } else {
      messageApi.warning({
        duration: 5,
        content: '没有选择目录',
      });
    }
  };
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
        <Tooltip title="删除项目">
          <Button
            variant="outlined"
            color="danger"
            icon={<DeleteTwoTone twoToneColor="red" />}
            size="small"
            onClick={deleteFn}
          ></Button>
        </Tooltip>

        <Tooltip title="刷新列表">
          <Button
            variant="outlined"
            icon={<ReloadOutlined />}
            size="small"
            onClick={refreshFn}
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};
