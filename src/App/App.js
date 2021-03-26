import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { EditOutlined, PieChartOutlined } from '@ant-design/icons';
import { loadEvents } from '../ducks';
import DataViewPage from './DataViewPage';
import DataEditorPage from './DataEditorPage';
import { editorDataPage, viewDataPage } from './routes';

const ROUTES = [viewDataPage, editorDataPage];

const FULL_SIDER_WIDTH = 240;

const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const selectedMenuKeys = useMemo(
    () => [ROUTES.find((route) => route === pathname)],
    [pathname],
  );

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  return (
    <Layout style={{ minHeight: '100vh' }} hasSider>
      <Layout.Sider
        theme="dark"
        collapsible
        width={FULL_SIDER_WIDTH}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu theme="dark" mode="inline" selectedKeys={selectedMenuKeys}>
          <Menu.Item key={viewDataPage}>
            <Link to={viewDataPage}>
              <PieChartOutlined />
              <span>Просмотр данных</span>
            </Link>
          </Menu.Item>
          <Menu.Item key={editorDataPage}>
            <Link to={editorDataPage}>
              <EditOutlined />
              <span>Редактирование данных</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : FULL_SIDER_WIDTH,
          transition: 'margin 0.2s',
        }}
      >
        <Layout.Content>
          <Switch>
            <Route path={viewDataPage} component={DataViewPage} />
            <Route path={editorDataPage} component={DataEditorPage} />
            <Redirect to={viewDataPage} />
          </Switch>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};

export default App;
