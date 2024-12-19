/*
 * @Author: fei690940217 690940217@qq.com
 * @Date: 2022-09-30 11:18:26
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 16:33:50
 * @FilePath: \pxa_signal_analyzer\src\renderer\page\layout\index.jsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router';
import { Outlet, useNavigate, useSearchParams } from 'react-router';

import { Menu, Layout, Spin, Button, message } from 'antd';
import {
  SettingOutlined,
  PlayCircleOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import './index.scss';
import FooterNotice from './footerNotice';
import Loading from '@/components/loading';
import { useNetwork } from 'ahooks';
import { useTranslation } from 'react-i18next';
import VersionModal from './versionModal';
import StatusBar from './statusConfig';
import { logInfo } from '@/utils/logLevel.js';
import log from 'loglevel';
import {
  electronStoreGet,
  electronStoreGetAsync,
} from '@src/renderer/utils/electronStore';
const { Header, Content, Footer } = Layout;
const { ipcRenderer } = window.myApi;
export default () => {
  const { t, i18n } = useTranslation('home');
  const { online } = useNetwork();
  const [messageApi, messageContextHolder] = message.useMessage();
  const isInProgress = useSelector((state) => state.testStatus.isInProgress);
  const isLoading = useSelector((state) => state.home.isLoading);
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
  const onClick = ({ key }) => {
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
        await ipcRenderer.invoke('forceRestartVisaProxy');
        messageApi.success('visa已重启');
      } else {
        messageApi.error('请确保网络连接');
      }
    } catch (error) {
      messageApi.error(error?.message);
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
    const res = await electronStoreGetAsync('currentRow');
    console.log('异步', res);
    const res1 = electronStoreGet('currentRow');
    console.log('同步', res1);
  };
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
