import React from "react";
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Bar,CartesianGrid } from "recharts";

export default function BoxPlotGraph() {
  const data = [
    { name: "A", min: 10, q1: 20, median: 30, q3: 40, max: 55 },
    { name: "B", min: 5, q1: 16, median: 22, q3: 35, max: 50 },
    { name: "C", min: 12, q1: 25, median: 33, q3: 44, max: 60 },
    { name: "D", min: 8, q1: 18, median: 28, q3: 38, max: 49 },
  ];

  const allValues = data.flatMap(d => [d.min, d.max]);
  const yMin = Math.min(...allValues) - 5;
  const yMax = Math.max(...allValues) + 5;

  const renderBox = (props: any) => {
    const { x, y, width, height, payload } = props;
    const scaleY = (val: number) => y + height - ((val - yMin) / (yMax - yMin)) * height;

    const minY = scaleY(payload.min);
    const q1Y = scaleY(payload.q1);
    const medianY = scaleY(payload.median);
    const q3Y = scaleY(payload.q3);
    const maxY = scaleY(payload.max);

    return (
      <g>
        <line x1={x + width / 2} x2={x + width / 2} y1={maxY} y2={q3Y} stroke="#374151" strokeWidth="2" />
        <line x1={x + width / 2} x2={x + width / 2} y1={minY} y2={q1Y} stroke="#374151" strokeWidth="2" />
        <line x1={x + 5} x2={x + width - 5} y1={maxY} y2={maxY} stroke="#374151" strokeWidth="2" />
        <line x1={x + 5} x2={x + width - 5} y1={minY} y2={minY} stroke="#374151" strokeWidth="2" />
        <rect x={x + 5} y={q3Y} width={width - 10} height={q1Y - q3Y} fill="#E5E7EB" stroke="#374151" strokeWidth="2" rx="3" />
        <line x1={x + 5} x2={x + width - 5} y1={medianY} y2={medianY} stroke="#111827" strokeWidth="2" />
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const p = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow-lg">
          <strong>{p.name}</strong>
          <div>Min: {p.min}</div>
          <div>Q1: {p.q1}</div>
          <div>Median: {p.median}</div>
          <div>Q3: {p.q3}</div>
          <div>Max: {p.max}</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[260px] bg-white">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.5} />
          <XAxis dataKey="name" />
          <YAxis domain={[yMin, yMax]} />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="median" barSize={50} fill="transparent" shape={renderBox} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
