/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 10:27:57
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\testPage\index.tsx
 * @Description: 测试与列表主页
 */
import { useEffect } from 'react';
import './index.scss';
import PlanTableCard from './planTableCard';
import ProjectList from './projectListPage';
import LogCard from './logCard';
import { SmileOutlined } from '@ant-design/icons';
import { Result } from 'antd';
import { useAppSelector } from '@src/renderer/hook';

export default () => {
  const currentRow = useAppSelector((state) => state.projectList.currentRow);
  useEffect(() => {}, []);
  return (
    <div className="test-plan-wrapper">
      <div className="test-plan-content">
        <div className="content-left">
          <ProjectList />
        </div>
        <div className="content-right">
          {currentRow?.id ? (
            <PlanTableCard />
          ) : (
            <Result
              style={{ height: '100%' }}
              icon={<SmileOutlined style={{ color: '#DCDFE6' }} />}
              subTitle="请勾选测试项目后继续"
            />
          )}
        </div>
      </div>
      <div className="test-plan-footer">
        <LogCard />
      </div>
    </div>
  );
};
