import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruLocale from 'antd/lib/locale/ru_RU';
import { store } from './store';
import { PagesRouter } from './App/PagesRouter';
import 'antd/dist/reset.css';
import './index.css';

const renderApp = () => (
  <React.StrictMode>
    <HashRouter>
      <Provider store={store}>
        <ConfigProvider locale={ruLocale}>
          <PagesRouter />
        </ConfigProvider>
      </Provider>
    </HashRouter>
  </React.StrictMode>
);

const root = createRoot(document.getElementById('root') as HTMLElement);

root.render(renderApp());
