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

  // const COLORS = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"];
  const defaultColors = ["#4F46E5", "#6366F1", "#818CF8", "#A5B4FC"];

  const getColor = (name: string, index: number) => {
    const colors = config.style?.colors || config.style?.pieColor;

    // 🎯 CASE 1: axis-wise mapping
    if (colors?.mapping && typeof colors.mapping === "object") {
      return colors.mapping[name] || defaultColors[index % defaultColors.length];
    }

    // 🎯 CASE 2: array of colors
    if (Array.isArray(colors) && colors.length > 0) {
      return colors[index % colors.length];
    }

    // 🎯 fallback
    return defaultColors[index % defaultColors.length];
  };

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
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={getColor(entry.name, i)}
              />
            ))}

          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
