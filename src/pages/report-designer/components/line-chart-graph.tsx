import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function LineChartGraph({ config }: { config: any }) {
  if (!config?.rows || !config?.xAxis || !config?.yAxis) return null;

  const grouped: Record<string, number> = {};

  config.rows.forEach((r: any) => {
    const key = String(r[config.xAxis]);
    grouped[key] =
      (grouped[key] || 0) + Number(r[config.yAxis] || 0);
  });

  const data = Object.entries(grouped).map(([k, v]) => ({
    name: k,
    value: v
  }));

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
        >
          {/* Grid */}
          <CartesianGrid
            vertical={false}
            stroke="#E5E7EB"
            strokeDasharray="3 3"
          />

          {/* Gradient Definition */}
          <defs>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366F1" />   {/* indigo */}
              <stop offset="100%" stopColor="#22C55E" /> {/* green */}
            </linearGradient>
          </defs>

          <XAxis
            dataKey="name"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={false}
          />

          <YAxis
            tick={{ fontSize: 11, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              fontSize: 12
            }}
            labelStyle={{ color: "#374151", fontWeight: 600 }}
            formatter={(v: number) => [
              v,
              config.yAxis.replace(/_/g, " ").toUpperCase()
            ]}
          />

          {/* Colorful Line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: "#6366F1",
              stroke: "#ffffff",
              strokeWidth: 2
            }}
            activeDot={{
              r: 7,
              fill: "#22C55E",
              stroke: "#ffffff",
              strokeWidth: 2
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
