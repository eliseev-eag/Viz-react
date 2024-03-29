import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generatePath, Route, Routes, useNavigate } from 'react-router-dom';
import { Button, Input, message } from 'antd';
import DownloadOutlined from '@ant-design/icons/DownloadOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';
import { uniqueId } from 'lodash-es';
import {
  addEvent,
  deleteEvent,
  editEvent,
  eventsComplexSelector,
  eventsWithNestedDataSelector,
  eventTypesSelector,
} from 'events-slice';
import { editorDataPage } from 'App/routes';
import { EventsTable } from './EventsTable';
import { EventForm } from './EventForm';
import { addRoute, editRoute } from './routes';
import styles from './styles.module.css';

export const DataEditorPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('');
  const eventTypes = useSelector(eventTypesSelector);
  const complexData = useSelector(eventsComplexSelector);
  const denormalizedEvents = useSelector(eventsWithNestedDataSelector);
  const eventsWithNestedData = useMemo(
    () =>
      denormalizedEvents.filter((it) =>
        it.name.toLowerCase().includes(filter.toLowerCase()),
      ),
    [denormalizedEvents, filter],
  );

  const onSelect = useCallback(
    (value) => {
      navigate(generatePath(editRoute, { id: value.id }), {
        relative: 'route',
      });
    },
    [navigate],
  );

  const closeForm = useCallback(() => {
    navigate(editorDataPage);
  }, [navigate]);

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
    navigate(addRoute, {
      relative: 'route',
    });
  }, [navigate]);

  const contentForExportButton = useMemo(
    () => JSON.stringify(complexData),
    [complexData],
  );

  return (
    <>
      <div>
        <div className={styles.pageHeader}>
          <Input.Search
            placeholder="Введите значение для поиска"
            onSearch={setFilter}
            style={{ width: 400 }}
            data-id="search"
          />
          <div className={styles.buttons}>
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
          </div>
        </div>
        <EventsTable
          events={eventsWithNestedData}
          eventTypes={eventTypes}
          onSelect={onSelect}
          deleteRow={onDelete}
        />
      </div>
      <Routes>
        <Route
          path={addRoute}
          element={
            <EventForm
              onClose={closeForm}
              onSubmit={createEvent}
              title="Добавление события"
            />
          }
        />
        <Route
          path={editRoute}
          element={
            <EventForm
              onClose={closeForm}
              onSubmit={changeEvent}
              title="Редактирование события"
            />
          }
        />
      </Routes>
    </>
  );
};
