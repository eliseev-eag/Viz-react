import { useSelector } from 'react-redux';
import { Form as FinalForm } from 'react-final-form';
import { useParams } from 'react-router-dom';
import { Button, Drawer, Form, Spin } from 'antd';
import moment from 'moment';
import { DateBox, LazySelectSearch, SelectBox, TextArea } from 'components';
import {
  eventsSelector,
  eventTypesSelector,
  personsSelector,
  toponymsSelector,
} from 'selectors';
import {
  composeValidators,
  dateLessThanOrEqual,
  dateMoreThanOrEqual,
  required,
} from './validators';

const typeNameFactory = (it) => it.type;

const patronNameFactory = (it) => `${it.surname} ${it.name} ${it.patron}`;

const convertEventToFormFormat = (event) => ({
  ...event,
  startDate: moment(event.startDate),
  endDate: moment(event.endDate),
});

const INITIAL_EVENT_VALUE = {
  name: null,
  startDate: null,
  endDate: null,
  type: null,
  toponyms: [],
  persons: [],
};

const EventForm = ({ onSubmit, onClose, title }) => {
  const eventTypes = useSelector(eventTypesSelector);
  const toponyms = useSelector(toponymsSelector);
  const persons = useSelector(personsSelector);
  const events = useSelector(eventsSelector);
  const { id: eventId } = useParams();

  if (events.length < 1) {
    return (
      <Drawer
        title={title}
        onClose={onClose}
        placement="right"
        width={450}
        visible
        closable
        destroyOnClose
      >
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
      </Drawer>
    );
  }

  const event = events.find((it) => it.id === Number(eventId));

  const initialValues = event
    ? convertEventToFormFormat(event)
    : INITIAL_EVENT_VALUE;

  return (
    <Drawer
      title={title}
      onClose={onClose}
      placement="right"
      width={450}
      visible
      closable
      destroyOnClose
    >
      <FinalForm
        initialValues={initialValues}
        onSubmit={(values) => {
          onSubmit(values);
        }}
      >
        {({ handleSubmit }) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item>
              <TextArea
                name="name"
                label="Название"
                rows={4}
                placeholder="Название"
                validate={required}
              />
            </Form.Item>
            <Form.Item>
              <DateBox
                name="startDate"
                label="Дата начала"
                validate={composeValidators(
                  required,
                  dateLessThanOrEqual('endDate', 'Дата окончания'),
                )}
              />
            </Form.Item>
            <Form.Item>
              <DateBox
                name="endDate"
                label="Дата окончания"
                validate={composeValidators(
                  required,
                  dateMoreThanOrEqual('startDate', 'Дата начала'),
                )}
              />
            </Form.Item>
            <Form.Item>
              <SelectBox
                name="type"
                label="Тип"
                options={eventTypes}
                optionNameFactory={typeNameFactory}
                validate={required}
              />
            </Form.Item>
            <Form.Item>
              <LazySelectSearch
                name="toponyms"
                label="Топонимы"
                allOptions={toponyms}
                placeholder="Выберите топонимы"
              />
            </Form.Item>
            <Form.Item>
              <LazySelectSearch
                name="persons"
                label="Действующие лица"
                allOptions={persons}
                optionNameFactory={patronNameFactory}
                placeholder="Выберите действующих лиц"
              />
            </Form.Item>
            <div
              style={{
                position: 'absolute',
                right: 0,
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e9e9e9',
                padding: '10px 16px',
                background: '#fff',
                textAlign: 'right',
              }}
            >
              <Button htmlType="submit" type="primary">
                Сохранить
              </Button>
            </div>
          </Form>
        )}
      </FinalForm>
    </Drawer>
  );
};

export default EventForm;
