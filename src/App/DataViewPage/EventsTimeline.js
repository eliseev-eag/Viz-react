import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { extent, range } from 'd3-array';
import { scaleBand, scaleOrdinal, scaleTime } from 'd3-scale';
import { schemeSet2 } from 'd3-scale-chromatic';
import { eventsSelector, eventTypesSelector } from 'selectors';
import TimelineAxis from './TimelineAxis';

const DEFAULT_WIDTH = 400;
const DEFAULT_HEIGHT = 400;
const MARGIN_LEFT = 50;
const MARGIN_TOP = 0;
const MARGIN_BOTTOM = 20;

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

  const getColor = scaleOrdinal(schemeSet2).domain(evenTypesAsString);

  const xScale = scaleTime()
    .domain(extent(domainDates))
    .range([MARGIN_LEFT, sizes.width - MARGIN_LEFT])
    .nice();

  const xTicks = xScale.ticks().map((value) => ({
    value: value.toLocaleDateString(),
    xOffset: xScale(value),
  }));

  const eventsForDrawing = eventsWithTypes
    .map((event) => {
      const x1 = xScale(event.startDate);
      const x2 = xScale(event.endDate);
      const width = x2 - x1;
      return { x1, x2, width, ...event };
    })
    .filter((event) => event.width > 10);

  const yScale = scaleBand()
    .domain(range(eventsForDrawing.length))
    .range([MARGIN_TOP, sizes.height - MARGIN_BOTTOM])
    .paddingOuter(0.3)
    .paddingInner(0.1);

  useLayoutEffect(() => {
    const { width, height } = svgRef.current.getBoundingClientRect();
    setSizes({ width, height });
  }, []);

  return (
    <svg className="timeline-container" ref={svgRef}>
      {eventsForDrawing.map((event, index) => (
        <g key={event.id}>
          <rect
            x={event.x1}
            width={event.width}
            y={yScale(index)}
            height={yScale.bandwidth()}
            fill={getColor(event.type)}
          />
          <text
            x={event.x1 + event.width / 2}
            y={yScale(index) + yScale.bandwidth() / 2}
            dominantBaseline="middle"
            textAnchor="middle"
            style={{ fontSize: `${yScale.bandwidth()}px` }}
          >
            {event.name}
          </text>
        </g>
      ))}
      <TimelineAxis
        ticks={xTicks}
        xMin={MARGIN_LEFT}
        xMax={sizes.width - MARGIN_LEFT}
        yMax={sizes.height - MARGIN_BOTTOM}
      />
    </svg>
  );
};

export default EventsTimeline;
