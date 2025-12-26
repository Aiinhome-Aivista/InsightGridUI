import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function PieChartGraph({ config }: { config: any }) {
  if (!config?.rows || !config?.xAxis || !config?.yAxis) return null;

  const grouped: Record<string, number> = {};

  config.rows.forEach((r: any) => {
    const key = String(r[config.xAxis]);

    if (config.agg === "count") {
      grouped[key] = (grouped[key] || 0) + 1;
    } else {
      grouped[key] =
        (grouped[key] || 0) + Number(r[config.yAxis] || 0);
    }
  });


  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value
  }));

  const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"];

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius="80%"
            label
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
