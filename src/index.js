import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { HashRouter as Router } from 'react-router-dom';
import store from './store';
import App from './App/App';
import './index.css';

const renderApp = () => (
  <Router>
    <Provider store={store}>
      <App />
    </Provider>
  </Router>
);

ReactDOM.render(renderApp(), document.getElementById('root'));
