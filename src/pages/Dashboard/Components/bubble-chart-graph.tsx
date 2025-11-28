import { useEffect, useState } from "react";
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, CartesianGrid } from "recharts";

interface BubbleDataPoint {
  x: number;
  y: number;
  z: number;
  name: string;
  color: string;
}

export default function BubbleChartGraph() {
  const [animationProgress, setAnimationProgress] = useState(0);

  // Hardcoded data for the bubble chart
  const rawData: BubbleDataPoint[] = [
    { x: 30, y: 40, z: 200, name: "Product A", color: "#8b5cf6" },
    { x: 50, y: 60, z: 300, name: "Product B", color: "#ec4899" },
    { x: 70, y: 30, z: 180, name: "Product C", color: "#3b82f6" },
    { x: 20, y: 70, z: 250, name: "Product D", color: "#10b981" },
    { x: 90, y: 50, z: 350, name: "Product E", color: "#f59e0b" },
    { x: 60, y: 80, z: 280, name: "Product F", color: "#ef4444" },
    { x: 40, y: 20, z: 150, name: "Product G", color: "#06b6d4" },
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

  // Animate the bubble data
  const animatedData = rawData.map((item) => ({
    ...item,
    x: item.x * animationProgress,
    y: item.y * animationProgress,
    z: item.z * animationProgress,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">X: {Math.round(data.x)}</p>
          <p className="text-sm text-gray-600">Y: {Math.round(data.y)}</p>
          <p className="text-sm text-gray-600">Size: {Math.round(data.z)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{ height: '200px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <defs>
              {rawData.map((item, index) => (
                <radialGradient key={`gradient-${index}`} id={`bubbleGradient-${index}`}>
                  <stop offset="0%" stopColor={item.color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0.4} />
                </radialGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              type="number" 
              dataKey="x" 
              name="Performance" 
              domain={[0, 100]}
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
            />
            <YAxis 
              type="number" 
              dataKey="y" 
              name="Quality" 
              domain={[0, 100]}
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
            />
            <ZAxis 
              type="number" 
              dataKey="z" 
              range={[50, 400]} 
              name="Sales"
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
            <Scatter data={animatedData} animationDuration={0}>
              {animatedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#bubbleGradient-${index})`}
                  stroke={entry.color}
                  strokeWidth={2}
                  opacity={0.9}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-4 mt-2 text-xs flex-wrap">
        {rawData.map((item, index) => (
          <div key={index} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ 
                background: `radial-gradient(circle, ${item.color} 0%, ${item.color}80 100%)`,
                border: `2px solid ${item.color}`
              }}
            ></div>
            <span className="text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </>
  );
}