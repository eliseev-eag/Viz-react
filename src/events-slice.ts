import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { orderBy, uniqueId } from 'lodash-es';
import {
  Event,
  EventType,
  Toponym,
  Person,
  EventWithFullData,
} from 'src/types';

type EventsSliceState = {
  eventTypes: EventType[];
  toponyms: Toponym[];
  persons: Person[];
  events: Event[];
};

export const loadEvents = createAsyncThunk('events/fetchEvents', async () => {
  const response = await fetch(`/events.json`);
  const events = await response.json();
  return events as EventsSliceState;
});

const initialState: EventsSliceState = {
  eventTypes: [],
  persons: [],
  toponyms: [],
  events: [],
};

const eventsSlice = createSlice({
  initialState,
  name: 'events',
  reducers: {
    editEvent: (state, data) => {
      const { events } = state;

      for (const [index, value] of Object.entries(events)) {
        if (value.id === data.payload.id) {
          events[parseInt(index, 10)] = data.payload;
          break;
        }
      }
    },
    deleteEvent: (state, data) => {
      state.events = state.events.filter(
        (event) => event.id !== data.payload.id,
      );
    },
    addEvent: (state, data) => {
      state.events.push({ ...data.payload, id: uniqueId() });
    },
  },
  extraReducers(builder) {
    builder.addCase(loadEvents.fulfilled, (state, action) => {
      const { events, ...otherFields } = action.payload;

      events.forEach((event) => {
        event.startDate = new Date(event.startDate);
        event.endDate = new Date(event.endDate);
      });

      return {
        ...otherFields,
        events: orderBy(
          events,
          (event) => event.endDate.getTime() - event.startDate.getTime(),
          'desc',
        ),
      };
    });
  },
});

export const { addEvent, deleteEvent, editEvent } = eventsSlice.actions;

export const eventsSelector = (state: EventsSliceState) => state.events;
export const toponymsSelector = (state: EventsSliceState) => state.toponyms;
export const personsSelector = (state: EventsSliceState) => state.persons;
export const eventTypesSelector = (state: EventsSliceState) => state.eventTypes;

export const eventsWithNestedDataSelector = createSelector(
  eventsSelector,
  toponymsSelector,
  personsSelector,
  eventTypesSelector,
  (events, toponyms, persons, eventTypes) =>
    events.map((event) => ({
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
    })),
);

export const eventsComplexSelector = createSelector(
  eventsSelector,
  toponymsSelector,
  personsSelector,
  eventTypesSelector,
  (events, toponyms, persons, eventTypes) => ({
    events,
    eventTypes,
    toponyms,
    persons,
  }),
);

export default eventsSlice.reducer;
