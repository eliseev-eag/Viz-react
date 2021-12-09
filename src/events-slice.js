import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { orderBy, uniqueId } from 'lodash-es';

export const loadEvents = createAsyncThunk('events/fetchEvents', async () => {
  const response = await fetch(`${process.env.PUBLIC_URL}/events.json`);
  const events = await response.json();
  return events;
});

const initialState = {
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
          events[index] = data.payload;
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
          (event) => event.endDate - event.startDate,
          'desc',
        ),
      };
    });
  },
});

export const { addEvent, deleteEvent, editEvent } = eventsSlice.actions;

export const eventsSelector = (state) => state.events;
export const toponymsSelector = (state) => state.toponyms;
export const personsSelector = (state) => state.persons;
export const eventTypesSelector = (state) => state.eventTypes;

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
