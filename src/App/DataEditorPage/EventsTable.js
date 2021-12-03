import { useCallback, useMemo } from 'react';
import { Button, Popconfirm, Table } from 'antd';

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

const paginationOptions = {
  defaultPageSize: 20,
  pageSizeOptions: [20, 50, 100],
  position: ['bottomCenter'],
};

const EventsTable = ({ events, eventTypes, onSelect, deleteRow }) => {
  const onRow = useCallback(
    (record) => ({
      onClick: onSelect ? () => onSelect(record) : undefined,
    }),
    [onSelect],
  );

  const eventTypesFilter = useMemo(
    () =>
      eventTypes.map((eventType) => ({
        value: eventType.id,
        text: eventType.type,
      })),
    [eventTypes],
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
    <Table
      dataSource={events}
      rowKey={(event) => event.id}
      onRow={onRow}
      pagination={paginationOptions}
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
        filters={eventTypesFilter}
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
  );
};

export default EventsTable;
