import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import ruLocale from 'antd/lib/locale/ru_RU';
import store from './store';
import App from './App/App';
import './index.css';

const renderApp = () => (
  <Router>
    <Provider store={store}>
      <ConfigProvider locale={ruLocale}>
        <App />
      </ConfigProvider>
    </Provider>
  </Router>
);

ReactDOM.render(renderApp(), document.getElementById('root'));
