import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Route, useHistory } from 'react-router-dom';
import { Button, Input, Layout, message, PageHeader } from 'antd';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { uniqueId } from 'lodash-es';
import { addEvent, deleteEvent, editEvent } from 'ducks';
import {
  eventsSelector,
  eventTypesSelector,
  personsSelector,
  toponymsSelector,
} from 'selectors';
import { editorDataPage } from 'App/routes';
import EventsTable from './EventsTable';
import EventForm from './EventForm';
import { addRoute, editRoute } from './routes';

const DataEditorPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [filter, setFilter] = useState('');

  const eventTypes = useSelector(eventTypesSelector);
  const persons = useSelector(personsSelector);
  const toponyms = useSelector(toponymsSelector);
  const events = useSelector(eventsSelector);

  const eventsWithNestedData = useMemo(
    () =>
      events
        .map((event) => ({
          ...event,
          type: eventTypes.find((type) => type.id === event.type),
          persons: event.persons
            ? event.persons.map((personId) =>
                persons.find((person) => person.id === personId),
              )
            : [],
          toponyms: event.toponyms
            ? event.toponyms.map((toponymId) =>
                toponyms.find((toponym) => toponym.id === toponymId),
              )
            : [],
        }))
        .filter((it) => it.name.toLowerCase().includes(filter.toLowerCase())),
    [events, eventTypes, persons, toponyms, filter],
  );

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

  const contentForExportButton = useMemo(
    () =>
      JSON.stringify({
        events,
        eventTypes,
        toponyms,
        persons,
      }),
    [events, eventTypes, toponyms, persons],
  );

  return (
    <Layout>
      <PageHeader
        ghost={false}
        title={
          <Input.Search
            placeholder="Введите значение для поиска"
            onSearch={setFilter}
            style={{ width: 400 }}
            data-id="search"
          />
        }
        extra={
          <>
            <Button
              data-id="export-button"
              download="events.json"
              icon={<DownloadOutlined />}
              href={URL.createObjectURL(
                new Blob([contentForExportButton], {
                  type: 'application/json',
                }),
              )}
            >
              Экспортировать
            </Button>
            <Button
              type="primary"
              onClick={showAddForm}
              data-id="add-button"
              icon={<PlusOutlined />}
            >
              Добавить
            </Button>
          </>
        }
      />
      <Layout.Content>
        <EventsTable
          events={eventsWithNestedData}
          eventTypes={eventTypes}
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
