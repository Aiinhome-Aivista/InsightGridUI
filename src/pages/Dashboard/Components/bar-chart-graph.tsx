import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

export default function BarChartGraph() {
  // Bar heights (similar to your screenshot)
  const targetData = [
    { name: "A", value: 20 },
    { name: "B", value: 35 },
    { name: "C", value: 50 },
    { name: "D", value: 48 },
    { name: "E", value: 30 },
    { name: "F", value: 45 },
    { name: "G", value: 70 },
  ];

  // Animation effect
  const [chartData, setChartData] = useState(
    targetData.map((d) => ({ ...d, value: 0 }))
  );

  useEffect(() => {
    let step = 0;
    const totalSteps = 40;

    const animate = setInterval(() => {
      step++;
      if (step > totalSteps) {
        clearInterval(animate);
        return;
      }

      setChartData(
        targetData.map((item) => ({
          ...item,
          value: (item.value / totalSteps) * step,
        }))
      );
    }, 20);

    return () => clearInterval(animate);
  }, []);

  return (
    <div className="">


      {/* Bar Chart */}
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barCategoryGap="0%">
            <XAxis dataKey="name" hide />
            <Bar
              dataKey="value"
              fill="#D1D5DB"
              radius={[10, 10, 10, 10]}
              maxBarSize={32}
              isAnimationActive={true} // we animate manually
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
