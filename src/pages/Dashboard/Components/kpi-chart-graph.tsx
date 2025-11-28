import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function KpiMeter() {
  const value = 71;
  const target = 100;

  const [fillPercent, setFillPercent] = useState(0);     // blue arc animation
  const [needlePercent, setNeedlePercent] = useState(0); // needle animation

  useEffect(() => {
    const end = Math.min((value / target) * 100, 100);
    let frame = 0;
    const frames = 60;

    // STEP 1 — animate blue fill first
    const timer = setInterval(() => {
      frame++;
      const current = (end * frame) / frames;
      setFillPercent(current);

      // when fill is done → start needle animation
      if (frame === frames) {
        clearInterval(timer);
        animateNeedle(end);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value, target]);

  /** STEP 2 — animate needle AFTER fill animation finishes */
  const animateNeedle = (end) => {
    let frame = 0;
    const frames = 50;

    const needleTimer = setInterval(() => {
      frame++;
      setNeedlePercent((end * frame) / frames);
      if (frame >= frames) clearInterval(needleTimer);
    }, 20);
  };

  /** Chart config */
  const startAngle = 180;
  const endAngle = 0;

  const data = [
    { value: fillPercent },
    { value: 100 - fillPercent }
  ];

  /** Needle angle */
  const angle = -180 + needlePercent * 1.8;
  const rad = (Math.PI / 180) * angle;

  return (
    <div className="w-full h-[200px] flex flex-col items-center justify-center">
      <div className="relative" style={{ width: "520px", height: "300px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={165}
              outerRadius={210}
              cx={260}
              cy={230}
            >
              <Cell fill="#06b6d4" />
              <Cell fill="#e5e7eb" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* NEEDLE */}
        <svg
          width="100%"
          height="100%"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {(() => {
            const cx = 260;
            const cy = 230;

            const innerRadius = 165;
            const needleLength = 70;

            const baseX = cx + innerRadius * Math.cos(rad);
            const baseY = cy + innerRadius * Math.sin(rad);

            const tipX = baseX + needleLength * Math.cos(rad);
            const tipY = baseY + needleLength * Math.sin(rad);

            const angleOffset = Math.PI / 2;
            const width = 8;

            const leftX = baseX + width * Math.cos(rad + angleOffset);
            const leftY = baseY + width * Math.sin(rad + angleOffset);
            const rightX = baseX + width * Math.cos(rad - angleOffset);
            const rightY = baseY + width * Math.sin(rad - angleOffset);

            return (
              <>
                <polygon
                  points={`${tipX},${tipY} ${leftX},${leftY} ${rightX},${rightY}`}
                  fill="#030303"
                />
                <circle
                  cx={baseX}
                  cy={baseY}
                  r={10}
                  fill="#f9f908"
                  stroke="#e7ebeb"
                  strokeWidth="2"
                />
              </>
            );
          })()}
        </svg>

        {/* CENTER VALUE */}
        <div className="absolute bottom-4 w-full text-center">
          <div className="text-3xl font-bold text-gray-900">
            {Math.round(needlePercent)}%
          </div>
        </div>
      </div>
    </div>
  );
}
