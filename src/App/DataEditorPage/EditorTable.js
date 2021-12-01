import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash-es';
import { Button, Input, Popconfirm, Table } from 'antd';
import {
  eventsSelector,
  eventTypesSelector,
  personsSelector,
  toponymsSelector,
} from 'selectors';

const dateFormatter = (date) =>
  date.toLocaleString('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
const typeFormatter = (type) => type.type;
const personsFormatter = (persons) =>
  persons
    .map((person) => `${person.surname} ${person.name} ${person.patron}`)
    .join();
const toponymsFormatter = (toponyms) =>
  toponyms.map((toponym) => toponym.name).join();

const startDateSorter = (a, b) => a.startDate - b.startDate;

const endDateSorter = (a, b) => a.endDate - b.endDate;

const EditorTable = ({ onAdd, onSelect, deleteRow }) => {
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

  const onRow = useCallback(
    (record) => ({
      onClick: onSelect ? () => onSelect(record) : undefined,
    }),
    [onSelect],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSearch = useCallback(
    debounce((value) => setFilter(value)),
    [],
  );

  const renderDeleteButton = (_, record) => (
    <Popconfirm
      title="Вы уверены?"
      onConfirm={(event) => {
        event.stopPropagation();
        deleteRow(record);
      }}
      onCancel={(event) => {
        event.stopPropagation();
      }}
      okText="Да"
      cancelText="Нет"
    >
      <Button
        type="link"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        Удалить
      </Button>
    </Popconfirm>
  );

  return (
    <div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
        }}
      >
        <Button type="primary" onClick={onAdd} data-id="add-button">
          Добавить
        </Button>
        <Input.Search
          placeholder="Введите значение для поиска"
          onSearch={onSearch}
          style={{ width: 400 }}
          data-id="search"
        />
      </div>
      <Table
        dataSource={eventsWithNestedData}
        rowKey={(event) => event.id}
        onRow={onRow}
      >
        <Table.Column title="Название" dataIndex="name" width="35%" />
        <Table.Column
          title="Дата начала"
          dataIndex="startDate"
          width="10%"
          sorter={startDateSorter}
          render={dateFormatter}
        />
        <Table.Column
          title="Дата окончания"
          dataIndex="endDate"
          width="10%"
          sorter={endDateSorter}
          render={dateFormatter}
        />
        <Table.Column
          title="Тип"
          dataIndex="type"
          width="10%"
          filters={eventTypes.map((eventType) => ({
            value: eventType.id,
            text: eventType.type,
          }))}
          onFilter={(value, record) => record.type.id === value}
          render={typeFormatter}
        />
        <Table.Column
          title="Действующие лица"
          dataIndex="persons"
          width="15%"
          render={personsFormatter}
        />
        <Table.Column
          title="Топонимы"
          dataIndex="toponyms"
          width="15%"
          render={toponymsFormatter}
        />
        <Table.Column title="" key="delete" render={renderDeleteButton} />
      </Table>
    </div>
  );
};

export default EditorTable;
