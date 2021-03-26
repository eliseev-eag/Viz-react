import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import Timeline from 'react-visjs-timeline';
import { eventsSelector, eventTypesSelector } from 'selectors';

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;

const TIMELINE_OPTIONS = {
  align: 'center',
  minHeight: '400px',
  maxHeight: '400px',
  type: 'range',
  tooltip: {
    followMouse: true,
    overflowMethod: 'cap',
  },
  snap: null,
  orientation: { axis: 'both' },
  zoomMin: MILLISECONDS_IN_DAY * 5,
};

const renderTitle = (item) => `
  <div>
    <h3 className="event-name">${item.name}</h3>
    <hr />
    <div className="dates">
      <div>
        ${item.startDate.toLocaleDateString()} - ${item.endDate.toLocaleDateString()}
      </div>
      <div>
        <b>Продолжительность: </b>
        ${Math.floor((item.endDate - item.startDate) / MILLISECONDS_IN_DAY)} дн.
      </div>
    </div>
  </div>
`;

const EventsTimeline = () => {
  const events = useSelector(eventsSelector);
  const eventTypes = useSelector(eventTypesSelector);

  const items = useMemo(
    () =>
      events.slice(0, 10).map((event) => ({
        start: event.startDate,
        end: event.endDate,
        content: event.name,
        duration: event.endDate - event.startDate,
        group: event.type,
        type:
          event.endDate - event.startDate <= MILLISECONDS_IN_DAY
            ? 'point'
            : 'range',
        title: renderTitle(event),
      })),
    [events],
  );

  const groups = useMemo(
    () =>
      eventTypes.map((eventType) => ({
        id: eventType.id,
        content: eventType.type,
      })),
    [eventTypes],
  );

  return (
    <div>
      {items && items.length > 0 && (
        <Timeline options={TIMELINE_OPTIONS} items={items} groups={groups} />
      )}
    </div>
  );
};

export default EventsTimeline;
