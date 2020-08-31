/* eslint-disable no-unused-vars */
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { extent } from 'd3-array';
import { scaleBand, scaleTime } from 'd3-scale';
import { eventsSelector, eventTypesSelector } from 'selectors';

const WIDTH = 400;
const HEIGHT = 400;
const MARGIN_LEFT = 30;
const MARGIN_TOP = 30;
const TICK_LENGTH = 6;

const pixelsPerTick = 100;
const numberOfTicksTarget = Math.max(1, Math.floor(WIDTH / pixelsPerTick));

const EventsTimeline = () => {
  const events = useSelector(eventsSelector);
  const eventTypes = useSelector(eventTypesSelector);

  const domainDates = useMemo(
    () => events.flatMap((event) => [event.endDate, event.startDate]),
    [events],
  );

  const evenTypesAsString = useMemo(() => eventTypes.map((it) => it.type), [
    eventTypes,
  ]);

  const yScale = scaleBand()
    .domain(evenTypesAsString)
    .range([0, HEIGHT])
    .padding(0.1)
    .round();

  const xScale = scaleTime()
    .domain(extent(domainDates))
    .range([0, WIDTH])
    .nice();

  const ticks = xScale.ticks(numberOfTicksTarget).map((value) => ({
    value: value.toLocaleDateString(),
    xOffset: xScale(value),
  }));

  return (
    <svg>
      <path
        d={[
          'M',
          xScale.range()[0],
          TICK_LENGTH,
          'v',
          -TICK_LENGTH,
          'H',
          xScale.range()[1],
          'v',
          TICK_LENGTH,
        ].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: '10px',
              textAnchor: 'middle',
              transform: 'translateY(20px)',
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default EventsTimeline;
