/*
 * @Author: feifei
 * @Date: 2024-12-17 14:48:07
 * @LastEditors: feifei
 * @LastEditTime: 2024-12-18 14:24:32
 * @FilePath: \pxa_signal_analyzer\src\renderer\index.tsx
 * @Description:
 *
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved.
 */

import App from './App';
import { createRoot } from 'react-dom/client';
import '@/style/index.scss';
import { Provider } from 'react-redux';
import store from './store';
import { HashRouter } from 'react-router';

//引入i18n
import './i18n';
//挂在全局loading
const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(
  <Provider store={store}>
    <HashRouter>
      <App></App>
    </HashRouter>
  </Provider>,
);
