import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";

export default function PieChartGraph() {
  const [animatedValue, setAnimatedValue] = useState(0);
  const targetValue = 25;
  const gapSize = 5;

  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = targetValue / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimatedValue(currentStep * increment);
      } else {
        setAnimatedValue(targetValue);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  const blueAngle = (animatedValue / 100) * 360;
  const grayAngle = 360 - blueAngle - (gapSize * 2);

  const data = [
    { name: 'Gap1', value: gapSize, color: 'transparent' },
    { name: 'Completed', value: blueAngle, color: '#4F46E5' },
    { name: 'Gap2', value: gapSize, color: 'transparent' },
    { name: 'Remaining', value: grayAngle, color: '#E5E7EB' }
  ];

  return (
    <div className="relative flex items-center justify-center" style={{ height: '200px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            startAngle={90}
            endAngle={-270}
            innerRadius="65%"
            outerRadius="85%"
            paddingAngle={0}
            dataKey="value"
            strokeWidth={0}
            animationDuration={0}
            isAnimationActive={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-900">
            {Math.round(animatedValue)}%
          </div>
          <div className="text-sm text-gray-500 mt-1">Complete</div>
        </div>
      </div>
    </div>
  );
}