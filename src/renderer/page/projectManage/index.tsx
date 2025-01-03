/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-02 14:38:31
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\projectManage\index.tsx
 * @Description: 项目列表主表格
 */

import { Flex } from 'antd';
import { useState } from 'react';
import './index.scss';

import SubProjectList from './subProjectList';
import DirList from './dirList';
import { AddDirType } from '@src/customTypes';
export default () => {
  const [currentDir, setCurrentDir] = useState<AddDirType | null>(null);

  return (
    <Flex gap={5} className="project-manage-container">
      <DirList currentDir={currentDir} setCurrentDir={setCurrentDir} />
      <SubProjectList currentDir={currentDir} />
    </Flex>
  );
};
