import { useEffect, useState } from "react";
import { ResponsiveContainer, ComposedChart, Bar, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface MixedDataPoint {
  month: string;
  revenue: number;
  profit: number;
  growth: number;
}

export default function MixedChartGraph() {
  const [animationProgress, setAnimationProgress] = useState(0);

  // Hardcoded data for the mixed chart
  const rawData: MixedDataPoint[] = [
    { month: "Jan", revenue: 65, profit: 45, growth: 20 },
    { month: "Feb", revenue: 75, profit: 52, growth: 35 },
    { month: "Mar", revenue: 85, profit: 60, growth: 45 },
    { month: "Apr", revenue: 70, profit: 48, growth: 30 },
    { month: "May", revenue: 95, profit: 70, growth: 60 },
    { month: "Jun", revenue: 110, profit: 85, growth: 75 },
  ];

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setAnimationProgress(currentStep / steps);
      } else {
        setAnimationProgress(1);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Animate the data
  const animatedData = rawData.map((item) => ({
    month: item.month,
    revenue: item.revenue * animationProgress,
    profit: item.profit * animationProgress,
    growth: item.growth * animationProgress,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {Math.round(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex justify-center gap-6 mt-2">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{
                background: entry.color,
                opacity: entry.dataKey === 'growth' ? 0.6 : 1,
              }}
            ></div>
            <span className="text-xs text-gray-600">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={animatedData} margin={{ top: 10, right: 10, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="profitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="growthAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
            />
            <YAxis
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            
            {/* Area Chart for Growth (Background) */}
            <Area
              type="monotone"
              dataKey="growth"
              fill="url(#growthAreaGradient)"
              stroke="#f59e0b"
              strokeWidth={2}
              animationDuration={0}
              name="Growth"
            />
            
            {/* Bar Chart for Revenue */}
            <Bar
              dataKey="revenue"
              fill="url(#revenueGradient)"
              radius={[8, 8, 0, 0]}
              animationDuration={0}
              name="Revenue"
              maxBarSize={40}
            />
            
            {/* Line Chart for Profit */}
            <Line
              type="monotone"
              dataKey="profit"
              stroke="url(#profitGradient)"
              strokeWidth={3}
              dot={{
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 2,
                r: 5,
              }}
              activeDot={{
                r: 7,
                stroke: "#fff",
                strokeWidth: 2,
              }}
              animationDuration={0}
              name="Profit"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4 px-2">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-gradient-to-b from-purple-500 to-purple-700"></div>
            <span className="text-xs font-semibold text-gray-700">Revenue</span>
          </div>
          <p className="text-xs font-bold text-purple-600">
            ${Math.round(animatedData[animatedData.length - 1]?.revenue || 0)}k
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
            <span className="text-xs font-semibold text-gray-700">Profit</span>
          </div>
          <p className="text-xs font-bold text-green-600">
            ${Math.round(animatedData[animatedData.length - 1]?.profit || 0)}k
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-3 h-3 rounded bg-gradient-to-b from-amber-400 to-amber-500"></div>
            <span className="text-xs font-semibold text-gray-700">Growth</span>
          </div>
          <p className="text-xs font-bold text-amber-600">
            {Math.round(animatedData[animatedData.length - 1]?.growth || 0)}%
          </p>
        </div>
      </div>
    </>
  );
}