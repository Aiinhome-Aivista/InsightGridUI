// import { useEffect, useState } from "react";
// import {
//   Bar,
//   BarChart,
//   ResponsiveContainer,
//   XAxis,
//   Tooltip,
//   Cell
// } from "recharts";

// export default function BarChartGraph({ config }: { config: any }) {
//   if (!config?.rows || !config?.xAxis || !config?.yAxis) return null;

//   const grouped: Record<string, number> = {};

//   config.rows.forEach((r: any) => {
//     const key = String(r[config.xAxis]);

//     if (config.agg === "count") {
//       grouped[key] = (grouped[key] || 0) + 1;
//     } else {
//       grouped[key] =
//         (grouped[key] || 0) + Number(r[config.yAxis] || 0);
//     }
//   });


//   // const targetData = Object.entries(grouped).map(([k, v]) => ({
//   //   name: k,
//   //   value: v,
//   // }));


//   const order: string[] =
//     Array.isArray(config.xAxis_values) && config.xAxis_values.length > 0
//       ? config.xAxis_values              // 👈 FROM API RESPONSE
//       : Object.keys(grouped);             // fallback

//   const targetData = order
//     .filter(key => grouped[key] !== undefined)
//     .map(key => ({
//       name: key,
//       value: grouped[key]
//     }));


//   const [chartData, setChartData] = useState(
//     targetData.map(d => ({ ...d, value: 0 }))
//   );

//   useEffect(() => {
//     let step = 0;
//     const totalSteps = 25;

//     const timer = setInterval(() => {
//       step++;
//       if (step > totalSteps) {
//         clearInterval(timer);
//         return;
//       }

//       setChartData(
//         targetData.map(item => ({
//           ...item,
//           value: (item.value / totalSteps) * step
//         }))
//       );
//     }, 20);

//     return () => clearInterval(timer);
//   }, [config]);

//   return (
//     <div className="w-full h-[240px]">
//       <ResponsiveContainer width="100%" height="100%">
//         <BarChart data={chartData} barCategoryGap="20%">
//           <XAxis
//             dataKey="name"
//             label={{
//               value: config.xAxis.toUpperCase(),
//               position: "insideBottom",
//               offset: -5
//             }}
//           />
//           <Tooltip
//             formatter={(value: number) => [
//               value,
//               config.agg === "count"
//                 ? `Count of ${config.yAxis}`
//                 : `Total ${config.yAxis}`
//             ]}
//           />


//           <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={32}>
//             {chartData.map((entry, index) => (
//               <Cell
//                 key={index}
//                 fill={
//                   typeof config.style?.barColor === "string"
//                     ? config.style.barColor
//                     : config.style?.barColor?.mapping?.[entry.name] || "#D1D5DB"
//                 }
//               />
//             ))}
//           </Bar>

//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
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

  const order: string[] =
    Array.isArray(config.xAxis_values) && config.xAxis_values.length > 0
      ? config.xAxis_values
      : Object.keys(grouped);

  const targetData = order
    .filter(key => grouped[key] !== undefined)
    .map(key => ({
      name: key,
      value: grouped[key]
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
          value: Number(((item.value / totalSteps) * step).toFixed(1)) // 🔥 FIX float
        }))
      );
    }, 20);

    return () => clearInterval(timer);
  }, [config]);

  return (
    <div className="w-full h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barCategoryGap="28%"
          margin={{ top: 10, right: 20, left: 10, bottom: 20 }}
        >
          {/* ✨ subtle grid */}
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#E5E7EB"
          />

          {/* ✨ X Axis */}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={{ stroke: "#D1D5DB" }}
            tickLine={false}
            label={{
              value: config.xAxis.toUpperCase(),
              position: "insideBottom",
              offset: -10,
              fill: "#6B7280",
              fontSize: 12
            }}
          />

          {/* ✨ Y Axis */}
          <YAxis
            tick={{ fontSize: 12, fill: "#6B7280" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />

          {/* ✨ Tooltip */}
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,0.08)" }}
            contentStyle={{
              borderRadius: 8,
              border: "1px solid #E5E7EB",
              fontSize: 13
            }}
            formatter={(value: number) => [
              Math.round(value),
              config.agg === "count"
                ? `Count of ${config.yAxis}`
                : `Total ${config.yAxis}`
            ]}
          />

          {/* ✨ Bars */}
          <Bar
            dataKey="value"
            radius={[8, 8, 0, 0]}
            maxBarSize={36}
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={
                  typeof config.style?.barColor === "string"
                    ? config.style.barColor
                    : config.style?.barColor?.mapping?.[entry.name] ||
                      "#93C5FD" // nicer default
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
