/* eslint-disable no-unused-vars */
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

const PIXELS_PER_TICK = 100;

const EventsTimeline = () => {
  const events = useSelector(eventsSelector);
  const eventTypes = useSelector(eventTypesSelector);
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
    .round();

  const xScale = scaleTime()
    .domain(extent(domainDates))
    .range([MARGIN_LEFT, sizes.width - MARGIN_LEFT])
    .nice();

  const numberOfTicksTarget = Math.max(
    1,
    Math.floor((sizes.width - 2 * MARGIN_LEFT) / PIXELS_PER_TICK),
  );

  const ticks = xScale.ticks(numberOfTicksTarget).map((value) => ({
    value: value.toLocaleDateString(),
    xOffset: xScale(value),
  }));

  useEffect(() => {
    const { width, height } = svgRef.current.getBoundingClientRect();
    setSizes({ width, height });
  }, []);

  return (
    <svg className="timeline-container" ref={svgRef}>
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
