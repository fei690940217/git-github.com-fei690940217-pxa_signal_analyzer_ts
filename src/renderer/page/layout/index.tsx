/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-09-30 11:18:26
 * @LastEditors: feifei
 * @LastEditTime: 2025-01-07 15:25:05
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\layout\index.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { Outlet, useNavigate, useSearchParams } from 'react-router';

import { Menu, Layout, Spin, Button, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  SettingOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
  OrderedListOutlined,
} from '@ant-design/icons';
import './index.scss';
import FooterNotice from './footerNotice';
import Loading from '@/components/loading';
import { useNetwork } from 'ahooks';
import { useTranslation } from 'react-i18next';
import VersionModal from './versionModal';
import StatusBar from './statusConfig';
import { logInfo, logError } from '@/utils/logLevel';
import log from 'loglevel';
import {
  electronStoreGet,
  electronStoreGetAsync,
} from '@src/renderer/utils/electronStore';
import { useAppDispatch, useAppSelector } from '@src/renderer/hook';

const { Header, Content, Footer } = Layout;
const { ipcRenderer } = window.myApi;
export default () => {
  const { t, i18n } = useTranslation('home');
  const { online } = useNetwork();
  const [messageApi, messageContextHolder] = message.useMessage();
  const isInProgress = useAppSelector((state) => state.testStatus.isInProgress);
  const isLoading = useAppSelector((state) => state.home.isLoading);
  const [current, setCurrent] = useState('test');
  const [lang, setLang] = useState('zh');
  const [versionModalVisible, setVersionModalVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const items = [
    {
      label: t('testPage'),
      key: 'test',
      icon: <PlayCircleOutlined />,
    },
    {
      label: t('projectManage'),
      key: 'projectManage',
      icon: <OrderedListOutlined />,
    },
    {
      label: t('addProject'),
      key: 'add',
      icon: <PlusCircleOutlined />,
      disabled: isInProgress,
    },
    {
      label: t('set'),
      key: 'set',
      icon: <SettingOutlined />,
    },
  ];
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setCurrent('test');
    } else {
      setCurrent(path.substring(1));
    }
  }, [location]);
  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key !== current) {
      setCurrent(key);
      if (key === 'test') {
        navigate('/');
      } else {
        navigate('/' + key);
      }
    }
  };
  //Force restart 强制重启visa
  const forceRestartVisaProxy = async () => {
    try {
      if (online) {
        log.info('准备强制重启visa');
        await ipcRenderer.invoke('forceRestartVisaProxy');
        messageApi.success('visa已重启');
        log.info('已成功重启visa');
      } else {
        messageApi.error('请确保网络连接');
      }
    } catch (error) {
      messageApi.error(error?.toString());
      logError(`重启visa失败:${error?.toString()}`);
    }
  };
  const langChange = () => {
    if (lang === 'zh') {
      setLang('en');
      i18n.changeLanguage('en');
    } else {
      setLang('zh');
      i18n.changeLanguage('zh');
    }
  };
  //查看版本信息
  const viewVersion = () => {
    setVersionModalVisible(true);
  };
  const clickk = async () => {
    // ipcRenderer.send('test');
  };
  //强制更新所有配置文件
  const refreshConfigFile = () => {
    ipcRenderer.send('refreshConfigFile');
  };
  useEffect(() => {}, []);
  return (
    <Layout className="layout">
      <VersionModal
        modalVisible={versionModalVisible}
        closeModal={() => setVersionModalVisible(false)}
      />
      {messageContextHolder}
      {isLoading && <Loading tip="Loading..."></Loading>}
      <Header>
        <div style={{ flex: 1 }}>
          <Menu
            onClick={onClick}
            theme="dark"
            mode="horizontal"
            selectedKeys={[current]}
            items={items}
          />
        </div>
        <div className="version-icon-container">
          <i
            className="iconfont icon-banbengengxinjilu version-icon"
            onClick={viewVersion}
          ></i>
        </div>
        <div className="lang-icon-container" onClick={langChange}>
          {/* 中文标 */}
          {lang === 'zh' ? (
            <div className="lang-icon">CN</div>
          ) : (
            <div className="lang-icon">EN</div>
          )}
        </div>
        <div>
          <Button
            type="primary"
            ghost
            size="small"
            style={{ marginRight: 10 }}
            onClick={clickk}
          >
            Clickkkk
          </Button>
          <Button
            type="primary"
            ghost
            size="small"
            style={{ marginRight: 10 }}
            onClick={refreshConfigFile}
          >
            更新配置文件
          </Button>
          <Button
            type="primary"
            ghost
            size="small"
            style={{ marginRight: 10 }}
            onClick={forceRestartVisaProxy}
          >
            重启Visa
          </Button>
        </div>
      </Header>
      <Content>
        <Outlet />
      </Content>
      <Footer className="layout-footer">
        <div className="footer-notice-wrapper">
          <FooterNotice />
        </div>
        <div className="footer-copyright-wrapper">
          <span>
            Copyright ©{new Date().getFullYear()} MORLAB. All Rights Reserved
          </span>
        </div>
        <div className="status-container">
          <StatusBar></StatusBar>
        </div>
      </Footer>
    </Layout>
  );
};
