import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { generatePath, Route, useHistory } from 'react-router-dom';
import { Layout, message, PageHeader } from 'antd';
import { uniqueId } from 'lodash-es';
import { addEvent, deleteEvent, editEvent } from 'ducks';
import { editorDataPage } from 'App/routes';
import DownloadButton from './DownloadButton';
import EditorTable from './EditorTable';
import EventForm from './EventForm';
import { addRoute, editRoute } from './routes';

const DataEditorPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSelect = useCallback(
    (value) => {
      history.push(generatePath(editRoute, { id: value.id }));
    },
    [history],
  );

  const closeForm = useCallback(() => {
    history.push(editorDataPage);
  }, [history]);

  const changeEvent = useCallback(
    (value) => {
      dispatch(
        editEvent({
          ...value,
          endDate: value.endDate.toDate(),
          startDate: value.startDate.toDate(),
        }),
      );
      closeForm();
      message.success('Событие успешно изменено');
    },
    [dispatch, closeForm],
  );

  const onDelete = useCallback(
    (value) => {
      dispatch(deleteEvent(value));
    },
    [dispatch],
  );

  const createEvent = useCallback(
    (value) => {
      dispatch(
        addEvent({
          ...value,
          id: uniqueId(),
          endDate: value.endDate.toDate(),
          startDate: value.startDate.toDate(),
        }),
      );
      closeForm();
      message.success('Событие успешно добавлено');
    },
    [closeForm, dispatch],
  );

  const showAddForm = useCallback(() => {
    history.push(addRoute);
  }, [history]);

  return (
    <Layout>
      <PageHeader
        ghost={false}
        title="Редактирование данных"
        extra={<DownloadButton />}
      />
      <Layout.Content>
        <EditorTable
          onAdd={showAddForm}
          onSelect={onSelect}
          deleteRow={onDelete}
        />
        <Route
          path={addRoute}
          render={() => (
            <EventForm
              onClose={closeForm}
              onSubmit={createEvent}
              title="Добавление события"
            />
          )}
        />
        <Route
          path={editRoute}
          render={() => (
            <EventForm
              onClose={closeForm}
              onSubmit={changeEvent}
              title="Редактирование события"
            />
          )}
        />
      </Layout.Content>
    </Layout>
  );
};

export default DataEditorPage;
