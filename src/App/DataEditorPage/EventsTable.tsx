import { useCallback, useMemo } from 'react';
import { Button, Popconfirm, Table, TablePaginationConfig } from 'antd';
import type { EventWithFullData, EventType, Person, Toponym } from 'src/types';
import styles from './events-table.module.css';

const dateFormatter = (date: Date) =>
  date.toLocaleString('ru', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });

const typeFormatter = (type: EventType) => type.type;

const personsFormatter = (persons: Person[]) =>
  persons
    .map((person) =>
      [person.surname, person.name, person.patron].filter(Boolean).join(' '),
    )
    .join(', ');

const toponymsFormatter = (toponyms: Toponym[]) =>
  toponyms.map((toponym) => toponym.name).join(', ');

const startDateSorter = (a: EventWithFullData, b: EventWithFullData) =>
  a.startDate.valueOf() - b.startDate.valueOf();

const endDateSorter = (a: EventWithFullData, b: EventWithFullData) =>
  a.endDate.valueOf() - b.endDate.valueOf();

const paginationOptions: TablePaginationConfig = {
  defaultPageSize: 20,
  pageSizeOptions: [20, 50, 100],
  position: ['bottomCenter'],
};

type EventsTableProps = {
  events: EventWithFullData[];
  eventTypes: EventType[];
  onSelect: (event: EventWithFullData) => void;
  deleteRow: (event: EventWithFullData) => void;
};

export const EventsTable = ({
  events,
  eventTypes,
  onSelect,
  deleteRow,
}: EventsTableProps) => {
  const onRow = useCallback(
    (record: EventWithFullData) => ({
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

  const renderDeleteButton = (_: any, record: EventWithFullData) => (
    <Popconfirm
      title="Вы уверены?"
      onConfirm={(event) => {
        event?.stopPropagation();
        deleteRow(record);
      }}
      onCancel={(event) => {
        event?.stopPropagation();
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
      rowKey={(event: EventWithFullData) => event.id}
      onRow={onRow}
      pagination={paginationOptions}
      className={styles['events-table']}
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
        onFilter={(value, record: EventWithFullData) =>
          record.type.id === value
        }
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
