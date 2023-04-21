import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, matchPath, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { loadEvents } from '../events-slice';
import { editorDataPage } from './routes';

const ROUTES = [editorDataPage];

const FULL_SLIDER_WIDTH = 240;

export const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const selectedMenuKeys = useMemo(
    () => [ROUTES.find((route) => !!matchPath(route, pathname))],
    [pathname],
  );

  const menuItems = [
    {
      key: editorDataPage,
      label: <Link to={editorDataPage}>Редактирование данных</Link>,
      icon: <EditOutlined />,
    },
  ];

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  return (
    <Layout style={{ minHeight: '100vh' }} hasSider>
      <Layout.Sider
        theme="dark"
        collapsible
        width={FULL_SLIDER_WIDTH}
        collapsed={collapsed}
        onCollapse={setCollapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedMenuKeys}
          items={menuItems}
        />
      </Layout.Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 80 : FULL_SLIDER_WIDTH,
          transition: 'margin 0.2s',
        }}
      >
        <Layout.Content>
          <Outlet />
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
