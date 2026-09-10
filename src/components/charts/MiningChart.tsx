import React from "react";
import {
  ResponsiveContainer,
  LineChart as ReLineChart,
  Line,
  BarChart as ReBarChart,
  Bar,
  AreaChart as ReAreaChart,
  Area,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useTheme } from "../../providers/ThemeProvider";

export interface ChartDataPoint {
  [key: string]: any;
}

export interface ChartSeries {
  dataKey: string;
  name: string;
  color?: string;
}

export interface MiningChartProps {
  type?: "line" | "bar" | "area" | "pie";
  data: ChartDataPoint[];
  series: ChartSeries[];
  xAxisKey?: string;
  height?: number;
  unit?: string;
  stacked?: boolean;
}

const DEFAULT_COLORS = [
  "#10B981", // Emerald
  "#E5C158", // Gold
  "#38BDF8", // Sky Blue
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
];

export const MiningChart: React.FC<MiningChartProps> = ({
  type = "line",
  data,
  series,
  xAxisKey = "name",
  height = 300,
  unit = "",
  stacked = false,
}) => {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === "dark";

  const gridColor = isDark ? "#334155" : "#E2E8F0";
  const textColor = isDark ? "#94A3B8" : "#64748B";
  const tooltipBg = isDark ? "#0F172A" : "#FFFFFF";
  const tooltipBorder = isDark ? "#334155" : "#E2E8F0";

  const formatTooltipValue = (value: any) => {
    if (typeof value === "number") {
      return `${value.toLocaleString("id-ID")} ${unit}`;
    }
    return value;
  };

  const renderChart = () => {
    switch (type) {
      case "bar":
        return (
          <ReBarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xAxisKey} stroke={textColor} fontSize={11} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: "12px",
                fontSize: "12px",
                color: isDark ? "#F8FAFC" : "#0F172A",
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
              }}
              formatter={formatTooltipValue}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            {series.map((s, i) => (
              <Bar
                key={s.dataKey}
                dataKey={s.dataKey}
                name={s.name}
                fill={s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                stackId={stacked ? "a" : undefined}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </ReBarChart>
        );

      case "area":
        return (
          <ReAreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xAxisKey} stroke={textColor} fontSize={11} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: "12px",
                fontSize: "12px",
                color: isDark ? "#F8FAFC" : "#0F172A",
              }}
              formatter={formatTooltipValue}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            {series.map((s, i) => {
              const color = s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length];
              return (
                <Area
                  key={s.dataKey}
                  type="monotone"
                  dataKey={s.dataKey}
                  name={s.name}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                  stackId={stacked ? "a" : undefined}
                />
              );
            })}
          </ReAreaChart>
        );

      case "pie":
        const firstSeries = series[0];
        return (
          <RePieChart>
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: "12px",
                fontSize: "12px",
                color: isDark ? "#F8FAFC" : "#0F172A",
              }}
              formatter={formatTooltipValue}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            <Pie
              data={data}
              dataKey={firstSeries.dataKey}
              nameKey={xAxisKey}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
            >
              {data.map((_, entryIdx) => (
                <Cell
                  key={`cell-${entryIdx}`}
                  fill={DEFAULT_COLORS[entryIdx % DEFAULT_COLORS.length]}
                />
              ))}
            </Pie>
          </RePieChart>
        );

      case "line":
      default:
        return (
          <ReLineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey={xAxisKey} stroke={textColor} fontSize={11} tickLine={false} />
            <YAxis stroke={textColor} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: tooltipBg,
                borderColor: tooltipBorder,
                borderRadius: "12px",
                fontSize: "12px",
                color: isDark ? "#F8FAFC" : "#0F172A",
              }}
              formatter={formatTooltipValue}
            />
            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
            {series.map((s, i) => (
              <Line
                key={s.dataKey}
                type="monotone"
                dataKey={s.dataKey}
                name={s.name}
                stroke={s.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]}
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </ReLineChart>
        );
    }
  };

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};
