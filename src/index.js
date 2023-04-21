import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruLocale from 'antd/lib/locale/ru_RU';
import store from './store';
import { PagesRouter } from './App/PagesRouter';
import 'antd/dist/reset.css';
import './index.css';

const renderApp = () => (
  <Router>
    <Provider store={store}>
      <ConfigProvider locale={ruLocale}>
        <PagesRouter />
      </ConfigProvider>
    </Provider>
  </Router>
);

const root = createRoot(document.getElementById('root'));

root.render(renderApp());
