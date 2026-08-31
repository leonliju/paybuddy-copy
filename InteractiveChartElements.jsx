import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { getCategoryColor, formatINR, CHART_ANIMATION } from '../../lib/chartTheme';

/**
 * Custom Active Shape for Pie / Donut Charts
 * Renders the active slice expanded slightly with an outer glow ring and smooth label
 */
export const renderActiveDonutShape = (props) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    value,
    percent,
  } = props;

  return (
    <g>
      {/* Outer Glow Halo Ring */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 3}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        fillOpacity={0.4}
      />
      {/* Expanded Main Sector */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius - 2}
        outerRadius={outerRadius + 4}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#121214"
        strokeWidth={2}
      />
    </g>
  );
};

/**
 * Custom Rich Glass Tooltip for Pie / Donut Charts
 */
export function CustomPieTooltip({ active, payload, totalSum }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const category = data.name || data.payload?.category || 'Category';
  const val = Number(data.value) || 0;
  const color = data.payload?.fill || getCategoryColor(category);
  const total = totalSum || data.payload?.totalSum || val;
  const percent = total > 0 ? ((val / total) * 100).toFixed(1) : 0;

  return (
    <div className="bg-[#121214]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.85)] min-w-[160px] select-none pointer-events-none animate-fade-in z-50">
      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/10">
        <span
          className="w-2.5 h-2.5 rounded-full flex-shrink-0 shadow-[0_0_8px_currentColor]"
          style={{ backgroundColor: color, color }}
        />
        <span className="text-xs font-semibold text-white truncate max-w-[130px]">
          {category}
        </span>
      </div>

      <div className="space-y-1">
        <div className="text-base font-bold text-white tabular-nums tracking-tight font-display">
          {formatINR(val)}
        </div>
        <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
          <span>Share of spend</span>
          <span className="text-white font-semibold">{percent}%</span>
        </div>

        {/* Mini progress bar */}
        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, percent)}%`, backgroundColor: color }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Custom Rich Glass Tooltip for Bar Charts
 */
export function CustomBarTooltip({ active, payload, label, unit = 'Total Spend' }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];
  const val = Number(data.value) || 0;
  const color = data.fill || '#FFFFFF';

  return (
    <div className="bg-[#121214]/95 backdrop-blur-xl border border-white/20 rounded-2xl p-3.5 shadow-[0_12px_32px_rgba(0,0,0,0.85)] min-w-[150px] select-none pointer-events-none animate-fade-in z-50">
      <div className="text-xs font-medium text-zinc-400 font-mono mb-1.5 pb-1 border-b border-white/10 flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[10px] text-zinc-500 uppercase">{unit}</span>
      </div>

      <div className="flex items-baseline gap-2">
        <div className="text-lg font-bold text-white tabular-nums tracking-tight font-display">
          {formatINR(val)}
        </div>
      </div>
    </div>
  );
}

/**
 * Interactive Donut Chart with Category Color Mapping & Hover Synchronization
 */
export function InteractiveCategoryDonut({
  data = [],
  dataKey = 'total',
  nameKey = 'category',
  height = 220,
  innerRadius = 55,
  outerRadius = 80,
  showLegend = true,
  maxLegendItems = 4,
  className = '',
}) {
  const [activeIndex, setActiveIndex] = useState(-1);

  if (!data || data.length === 0) {
    return (
      <div className="h-full min-h-[160px] flex items-center justify-center text-xs text-zinc-400">
        No category records recorded.
      </div>
    );
  }

  const totalSum = data.reduce((acc, item) => acc + (Number(item[dataKey]) || 0), 0);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div className={`w-full flex flex-col items-center ${className}`}>
      {/* Chart Canvas */}
      <div className="w-full relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey={nameKey}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2.5}
              stroke="#0E0E10"
              strokeWidth={2}
              activeIndex={activeIndex >= 0 ? activeIndex : undefined}
              activeShape={renderActiveDonutShape}
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              {...CHART_ANIMATION}
            >
              {data.map((entry, index) => {
                const category = entry[nameKey] || `Category ${index + 1}`;
                const color = getCategoryColor(category, index);
                const isHovered = activeIndex === index;
                const isAnyHovered = activeIndex >= 0;

                return (
                  <Cell
                    key={`cell-${category}-${index}`}
                    fill={color}
                    opacity={isAnyHovered ? (isHovered ? 1 : 0.45) : 1}
                    className="transition-all duration-300 cursor-pointer"
                  />
                );
              })}
            </Pie>
            <Tooltip
              content={<CustomPieTooltip totalSum={totalSum} />}
              cursor={false}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Total / Hovered Detail Badge inside the Donut */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          {activeIndex >= 0 && data[activeIndex] ? (
            <div className="animate-fade-in space-y-0.5">
              <span
                className="text-[10px] font-semibold uppercase tracking-wider block truncate max-w-[90px] mx-auto"
                style={{ color: getCategoryColor(data[activeIndex][nameKey], activeIndex) }}
              >
                {data[activeIndex][nameKey]}
              </span>
              <span className="text-sm font-bold text-white tabular-nums block">
                {totalSum > 0
                  ? `${(((Number(data[activeIndex][dataKey]) || 0) / totalSum) * 100).toFixed(0)}%`
                  : '0%'}
              </span>
            </div>
          ) : (
            <div className="space-y-0.5 opacity-90">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400 block">
                Total
              </span>
              <span className="text-xs font-bold text-white tabular-nums block">
                {formatINR(totalSum)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Interactive Connected Legend */}
      {showLegend && (
        <div className="w-full space-y-2 pt-3 border-t border-white/5 mt-1">
          {data.slice(0, maxLegendItems).map((c, i) => {
            const category = c[nameKey];
            const val = Number(c[dataKey]) || 0;
            const color = getCategoryColor(category, i);
            const isHovered = activeIndex === i;
            const percent = totalSum > 0 ? ((val / totalSum) * 100).toFixed(1) : '0';

            return (
              <div
                key={`${category}-${i}`}
                onMouseEnter={() => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(-1)}
                className={`flex items-center justify-between text-xs p-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                  isHovered
                    ? 'bg-white/10 scale-[1.02] shadow-sm'
                    : 'hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-transform duration-200"
                    style={{
                      backgroundColor: color,
                      transform: isHovered ? 'scale(1.3)' : 'scale(1)',
                      boxShadow: isHovered ? `0 0 8px ${color}` : 'none',
                    }}
                  />
                  <span className={`truncate font-medium ${isHovered ? 'text-white' : 'text-zinc-300'}`}>
                    {category}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 tabular-nums flex-shrink-0 ml-2">
                  <span className="text-[11px] font-mono text-zinc-400">
                    {percent}%
                  </span>
                  <span className={`font-semibold ${isHovered ? 'text-white' : 'text-zinc-200'}`}>
                    {formatINR(val)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/**
 * Interactive Monthly or Categorical Bar Chart with smooth hover and animations
 */
export function InteractiveBarChartComponent({
  data = [],
  xKey = 'month',
  yKey = 'total',
  height = 250,
  barColor = '#E4E4E7',
  unitLabel = 'Expenditure',
  yAxisFormatter = (v) => `₹${v / 1000}k`,
  className = '',
}) {
  const [hoveredIndex, setHoveredIndex] = useState(-1);

  if (!data || data.length === 0) {
    return (
      <div className="h-full min-h-[180px] flex items-center justify-center text-xs text-zinc-400">
        No monthly historical data yet.
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
          onMouseLeave={() => setHoveredIndex(-1)}
        >
          <XAxis
            dataKey={xKey}
            stroke="#71717A"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
          />
          <YAxis
            stroke="#71717A"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            tickFormatter={yAxisFormatter}
          />
          <Tooltip
            content={<CustomBarTooltip unit={unitLabel} />}
            cursor={{ fill: 'rgba(255,255,255,0.03)', radius: 8 }}
          />
          <Bar
            dataKey={yKey}
            radius={[6, 6, 0, 0]}
            {...CHART_ANIMATION}
          >
            {data.map((entry, index) => {
              const isHovered = hoveredIndex === index;
              const isAnyHovered = hoveredIndex >= 0;
              // If item has a custom category, use its category color; otherwise sleek metallic silver
              const color = entry.category
                ? getCategoryColor(entry.category, index)
                : (entry.color || barColor);

              return (
                <Cell
                  key={`bar-${index}`}
                  fill={color}
                  opacity={isAnyHovered ? (isHovered ? 1 : 0.4) : 0.9}
                  stroke={isHovered ? '#FFFFFF' : 'none'}
                  strokeWidth={isHovered ? 1.5 : 0}
                  className="transition-all duration-300 cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(index)}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
