import React from 'react';
import './index.css';

const TICK_LENGTH = 6;
const TEXT_MARGIN = 20;

const TimelineAxis = ({ ticks, xMin, xMax, yMax }) => {
  return (
    <g className="x-axis">
      <path
        d={[
          'M',
          xMin,
          yMax - TEXT_MARGIN,
          'v',
          -TICK_LENGTH,
          'H',
          xMax,
          'v',
          TICK_LENGTH,
        ].join(' ')}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, ${
            yMax - TEXT_MARGIN - TICK_LENGTH
          })`}
        >
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            style={{
              textAnchor: 'middle',
              transform: `translateY(${TEXT_MARGIN}px)`,
              fontSize: '14px',
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  );
};

export default TimelineAxis;
