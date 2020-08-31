import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { extent } from 'd3-array';
import { scaleBand, scaleTime } from 'd3-scale';
import { eventsSelector, eventTypesSelector } from 'selectors';
import './index.css';

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;
const MARGIN_LEFT = 50;
const MARGIN_TOP = 50;
const TICK_LENGTH = 6;
const RECTANGLE_HEIGHT = 30;

const PIXELS_PER_TICK = 100;

const EventsTimeline = () => {
  const events = useSelector(eventsSelector);
  const eventTypes = useSelector(eventTypesSelector);

  const eventsWithTypes = useMemo(
    () =>
      events.map((event) => ({
        ...event,
        type: eventTypes.find((type) => type.id === event.type).type,
      })),
    [events, eventTypes],
  );

  const [sizes, setSizes] = useState({
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
  });
  const svgRef = useRef();

  const domainDates = useMemo(
    () => events.flatMap((event) => [event.endDate, event.startDate]),
    [events],
  );

  const evenTypesAsString = useMemo(() => eventTypes.map((it) => it.type), [
    eventTypes,
  ]);

  const yScale = scaleBand()
    .domain(evenTypesAsString)
    .range([MARGIN_TOP, sizes.height - MARGIN_TOP])
    .padding(0.1)
    .round(true);

  const xScale = scaleTime()
    .domain(extent(domainDates))
    .range([MARGIN_LEFT, sizes.width - MARGIN_LEFT])
    .nice();

  const numberOfTicksTarget = Math.max(
    1,
    Math.floor((sizes.width - 2 * MARGIN_LEFT) / PIXELS_PER_TICK),
  );

  const xTicks = xScale.ticks(numberOfTicksTarget).map((value) => ({
    value: value.toLocaleDateString(),
    xOffset: xScale(value),
  }));

  useEffect(() => {
    const { width, height } = svgRef.current.getBoundingClientRect();
    setSizes({ width, height });
  }, []);

  return (
    <svg className="timeline-container" ref={svgRef}>
      {eventsWithTypes
        .map((event) => {
          const x1 = xScale(event.startDate);
          const x2 = xScale(event.endDate);
          const y1 = yScale(event.type);
          const width = x2 - x1;
          return { x1, x2, y1, width, ...event };
        })
        .filter((event) => event.width > 10)
        .map((event) => (
          <g key={event.id}>
            <rect
              x={event.x1}
              width={event.width}
              y={event.y1}
              height={RECTANGLE_HEIGHT}
            />
            <text
              x={event.x1 + event.width / 2}
              y={event.y1 + RECTANGLE_HEIGHT / 2}
              dominantBaseline="middle"
              textAnchor="middle"
              stroke="white"
            >
              {event.name}
            </text>
          </g>
        ))}
      <g className="x-axis">
        <path
          d={[
            'M',
            xScale.range()[0],
            yScale.range()[1],
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
        {xTicks.map(({ value, xOffset }) => (
          <g
            key={value}
            transform={`translate(${xOffset}, ${
              yScale.range()[1] - TICK_LENGTH
            })`}
          >
            <line y2={TICK_LENGTH} stroke="currentColor" />
            <text
              style={{
                textAnchor: 'middle',
                transform: 'translateY(20px)',
              }}
            >
              {value}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default EventsTimeline;
