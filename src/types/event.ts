import type { Moment } from 'moment';
import { EventType } from './event-type';
import { Person } from './person';
import { Toponym } from './toponym';

export type Event = {
  id: number;
  name: string;
  type: number;
  startDate: Date;
  endDate: Date;
  parentEventId?: number;
  toponyms?: number[];
  persons?: number[];
};

export type EventWithFullData = {
  id: number;
  name: string;
  type: EventType;
  startDate: Moment;
  endDate: Moment;
  parentEventId?: number;
  toponyms?: Toponym[];
  persons?: Person[];
};
