import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  Tooltip
} from "recharts";

export default function BarChartGraph({ config }: { config: any }) {
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


  const targetData = Object.entries(grouped).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  const [chartData, setChartData] = useState(
    targetData.map(d => ({ ...d, value: 0 }))
  );

  useEffect(() => {
    let step = 0;
    const totalSteps = 25;

    const timer = setInterval(() => {
      step++;
      if (step > totalSteps) {
        clearInterval(timer);
        return;
      }

      setChartData(
        targetData.map(item => ({
          ...item,
          value: (item.value / totalSteps) * step
        }))
      );
    }, 20);

    return () => clearInterval(timer);
  }, [config]);

  return (
    <div className="w-full h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} barCategoryGap="20%">
          <XAxis
            dataKey="name"
            label={{
              value: config.xAxis.toUpperCase(),
              position: "insideBottom",
              offset: -5
            }}
          />
          <Tooltip
            formatter={(value: number) => [
              value,
              config.agg === "count"
                ? `Count of ${config.yAxis}`
                : `Total ${config.yAxis}`
            ]}
          />


          <Bar
            dataKey="value"
            fill="#D1D5DB"
            radius={[8, 8, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
