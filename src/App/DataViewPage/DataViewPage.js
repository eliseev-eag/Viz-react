import { useSelector } from 'react-redux';
import { Alert, Layout, PageHeader, Spin } from 'antd';
import { errorSelector, isFetchingSelector } from 'selectors';
import EventsTimeline from './EventsTimeline';

const DataViewPage = () => {
  const isFetching = useSelector(isFetchingSelector);
  const error = useSelector(errorSelector);

  return (
    <Layout>
      <PageHeader ghost={false} title="Просмотр данных" />
      <Layout.Content>
        {isFetching && (
          <div
            style={{
              minHeight: 200,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Spin size="large" />
          </div>
        )}
        {error && (
          <Alert
            message="Произошла ошибка"
            description={error}
            type="error"
            showIcon
          />
        )}
        {!isFetching && !error && <EventsTimeline />}
      </Layout.Content>
    </Layout>
  );
};

export default DataViewPage;
