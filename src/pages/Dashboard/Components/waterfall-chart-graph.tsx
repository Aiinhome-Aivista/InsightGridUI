import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface WaterfallDataPoint {
  name: string;
  value: number;
  isTotal?: boolean;
}


export default function WaterfallChartGraph() {
  const [animationProgress, setAnimationProgress] = useState(0);
  
  // Hardcoded data for the waterfall chart
  const rawData: WaterfallDataPoint[] = [
    { name: 'Starting', value: 100, isTotal: true },
    { name: 'Revenue', value: 50 },
    { name: 'Marketing', value: -15 },
    { name: 'Operations', value: -20 },
    { name: 'Sales', value: 30 },
    { name: 'R&D', value: -10 },
    { name: 'Total', value: 135, isTotal: true }
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

  const waterfallData = rawData.map((item, index) => {
    let start = 0;
    let end = 0;

    if (index === 0 || item.isTotal) {
      start = 0;
      end = item.value;
    } else {
      for (let i = 0; i < index; i++) {
        if (i === 0 || rawData[i].isTotal) {
          end = rawData[i].value;
        } else {
          end += rawData[i].value;
        }
      }
      start = end;
      end = start + item.value;
    }

    const animatedStart = start * animationProgress;
    const animatedEnd = start + (end - start) * animationProgress;

    return {
      name: item.name,
      start: animatedStart,
      end: animatedEnd,
      value: item.value,
      displayValue: Math.round((end - start) * animationProgress),
      isTotal: item.isTotal,
      isPositive: item.value > 0,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-1 rounded-lg shadow-lg border border-gray-200">
          <p className="text-gray-900" style={{ fontSize: '0.625rem' }}>{data.name}</p>
          <p className={`${data.isPositive ? 'text-green-600' : 'text-red-600'}`} style={{ fontSize: '0.625rem' }}>
            {data.isPositive ? '+' : ''}{data.displayValue}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div style={{ height: '250px' }}>
        <ResponsiveContainer width="80%" height="100%">
          <BarChart data={waterfallData}>
            <defs>
              <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0.9} />
              </linearGradient>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={80}
              stroke="#6b7280"
              style={{ fontSize: '10px' }}
            />
            <YAxis stroke="#6b7280" style={{ fontSize: '10px' }} />
            <Tooltip content={<CustomTooltip />} />
            
            <Bar dataKey="start" stackId="stack" fill="transparent" />
            
            <Bar 
              dataKey={(entry) => entry.end - entry.start} 
              stackId="stack"
              radius={[8, 8, 8, 8]}
              animationDuration={0}
            >
              {waterfallData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={
                    entry.isTotal 
                      ? 'url(#totalGradient)' 
                      : entry.isPositive 
                        ? 'url(#positiveGradient)' 
                        : 'url(#negativeGradient)'
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-gradient-to-b from-green-500 to-green-600"></div>
          <span className="text-gray-600 text-xs">Positive</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-gradient-to-b from-red-500 to-red-600"></div>
          <span className="text-gray-600 text-xs">Negative</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded bg-gradient-to-b from-indigo-500 to-indigo-600"></div>
          <span className="text-gray-600 text-xs">Total</span>
        </div>
      </div>
    </>
  );
}
