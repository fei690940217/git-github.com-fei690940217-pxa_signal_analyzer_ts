/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-07-14 11:37:59
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-19 17:31:56
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\addPage\RBPlanTable\index.tsx
 * @Description: 勾选测试项页面
 */

import './index.scss';
import { Card, Button } from 'antd';
import RBTableItem from './RBTableItem';
import { useTranslation } from 'react-i18next';
import { AddFormValueType } from '@src/customTypes/renderer';
const { ipcRenderer } = window.myApi;
type Props = {
  addFormValues: AddFormValueType | null;
  RBSelectedRowKeys: React.Key[];
  setRBSelectedRowKeys: (val: React.Key[]) => void;
};
export default ({
  addFormValues,
  RBSelectedRowKeys,
  setRBSelectedRowKeys,
}: Props) => {
  const { t, i18n } = useTranslation('addPage');
  const testItems = addFormValues?.testItems || '';
  //更新配置文件
  const refreshConfig = () => {
    ipcRenderer.send('refreshConfigFile');
  };
  return (
    <div className="add-project-sup-test-plan-wrapper">
      <Card
        title="RB Config"
        extra={
          <Button type="link" onClick={refreshConfig}>
            {t('refreshConfig')}
          </Button>
        }
        styles={{
          header: {
            minHeight: 36,
            padding: '0 5px',
          },
          body: {
            padding: '0 5px 5px 5px',
          },
        }}
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <RBTableItem
          testItem={testItems}
          RBSelectedRowKeys={RBSelectedRowKeys}
          setRBSelectedRowKeys={setRBSelectedRowKeys}
        />
      </Card>
    </div>
  );
};
