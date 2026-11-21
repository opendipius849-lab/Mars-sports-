import React from 'react';

interface RadarMetrics {
  attack: number;
  defense: number;
  form: number;
  h2hDominance: number;
  squadDepth: number;
  tacticalDiscipline: number;
}

interface RadarChartProps {
  homeName: string;
  awayName: string;
  homeColor?: string;
  awayColor?: string;
  homeMetrics: RadarMetrics;
  awayMetrics: RadarMetrics;
  size?: number;
}

const ATTRIBUTES = [
  { key: 'attack', label: 'Attack' },
  { key: 'defense', label: 'Defense' },
  { key: 'form', label: 'Form' },
  { key: 'h2hDominance', label: 'H2H' },
  { key: 'squadDepth', label: 'Depth' },
  { key: 'tacticalDiscipline', label: 'Tactics' },
] as const;

export const RadarChart: React.FC<RadarChartProps> = ({
  homeName,
  awayName,
  homeColor = '#3B82F6', // Blue
  awayColor = '#F43F5E', // Rose/Red
  homeMetrics,
  awayMetrics,
  size = 280,
}) => {
  const center = size / 2;
  const radius = (size / 2) - 40;
  const totalAxes = ATTRIBUTES.length;
  const angleStep = (Math.PI * 2) / totalAxes;

  // Calculate polygon points for concentric rings (20%, 40%, 60%, 80%, 100%)
  const rings = [0.25, 0.5, 0.75, 1.0];

  const getCoordinates = (value: number, index: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const homePoints = ATTRIBUTES.map((attr, idx) => {
    const val = homeMetrics[attr.key] || 50;
    const { x, y } = getCoordinates(val, idx);
    return `${x},${y}`;
  }).join(' ');

  const awayPoints = ATTRIBUTES.map((attr, idx) => {
    const val = awayMetrics[attr.key] || 50;
    const { x, y } = getCoordinates(val, idx);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center">
      {/* Legend */}
      <div className="flex items-center gap-6 mb-3 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50" />
          <span className="text-slate-200">{homeName}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
          <span className="text-slate-200">{awayName}</span>
        </div>
      </div>

      <svg width={size} height={size} className="overflow-visible select-none">
        {/* Background web rings */}
        {rings.map((ringFactor, rIdx) => {
          const ringPoints = ATTRIBUTES.map((_, idx) => {
            const angle = idx * angleStep - Math.PI / 2;
            const r = ringFactor * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');

          return (
            <polygon
              key={rIdx}
              points={ringPoints}
              fill={rIdx === rings.length - 1 ? 'rgba(30, 41, 59, 0.4)' : 'none'}
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray={rIdx < 3 ? '2,2' : undefined}
            />
          );
        })}

        {/* Axis lines */}
        {ATTRIBUTES.map((_, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const endX = center + radius * Math.cos(angle);
          const endY = center + radius * Math.sin(angle);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={endX}
              y2={endY}
              stroke="#334155"
              strokeWidth="1"
            />
          );
        })}

        {/* Home Team Polygon */}
        <polygon
          points={homePoints}
          fill="rgba(59, 130, 246, 0.35)"
          stroke={homeColor}
          strokeWidth="2.5"
          className="transition-all duration-500"
        />

        {/* Away Team Polygon */}
        <polygon
          points={awayPoints}
          fill="rgba(244, 63, 94, 0.3)"
          stroke={awayColor}
          strokeWidth="2.5"
          className="transition-all duration-500"
        />

        {/* Home points */}
        {ATTRIBUTES.map((attr, idx) => {
          const val = homeMetrics[attr.key] || 50;
          const { x, y } = getCoordinates(val, idx);
          return (
            <circle
              key={`home-${idx}`}
              cx={x}
              cy={y}
              r="4"
              fill={homeColor}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Away points */}
        {ATTRIBUTES.map((attr, idx) => {
          const val = awayMetrics[attr.key] || 50;
          const { x, y } = getCoordinates(val, idx);
          return (
            <circle
              key={`away-${idx}`}
              cx={x}
              cy={y}
              r="4"
              fill={awayColor}
              stroke="#0f172a"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {ATTRIBUTES.map((attr, idx) => {
          const angle = idx * angleStep - Math.PI / 2;
          const labelDist = radius + 22;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          const homeVal = homeMetrics[attr.key];
          const awayVal = awayMetrics[attr.key];

          return (
            <g key={`lbl-${idx}`}>
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-slate-300 text-[11px] font-semibold"
              >
                {attr.label}
              </text>
              <text
                x={x}
                y={y + 12}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[9px] fill-slate-500"
              >
                <tspan fill="#60A5FA">{homeVal}</tspan> | <tspan fill="#FB7185">{awayVal}</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
