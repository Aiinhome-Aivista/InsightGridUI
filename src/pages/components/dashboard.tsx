import React from "react";

export default function Dashboard() {
  return (
    <div className="h-screen bg-gray-50 p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-3 flex-shrink-0 pl-4">
        <h1 className="text-xl font-semibold text-gray-800">Insight</h1>
        <p className="text-xs text-gray-500">Untitled File Details</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0 p-4">
        {/* First Row: 4 small cards (40%) + 1 large card (60%) */}
        <div className="flex gap-4 h-[30%]">
          {/* Left side - 4 cards in 2x2 grid (40% width) */}
          <div className="w-[40%] grid grid-cols-2 gap-4">
            <div className="bg-[#D9D9D9] rounded-lg p-3">
              {/* Card 1 content */}
            </div>
            <div className="bg-[#D9D9D9] rounded-lg p-3">
              {/* Card 2 content */}
            </div>
            <div className="bg-[#D9D9D9] rounded-lg p-3">
              {/* Card 3 content */}
            </div>
            <div className="bg-[#D9D9D9] rounded-lg p-3">
              {/* Card 4 content */}
            </div>
          </div>

          {/* Right side - Large purple card (60% width) */}
          <div className="w-[60%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Large card content */}
          </div>
        </div>

        {/* Second Row: 3 cards with different widths */}
        <div className="flex gap-4 h-[25%]">
          <div className="w-[20%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 5 - 20% width */}
          </div>
          <div className="w-[50%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 6 - 50% width */}
          </div>
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 7 - 30% width */}
          </div>
        </div>

        {/* Third Row: 2 larger cards + 1 thin column with 4 small cards */}
        <div className="flex gap-4 h-[25%]">
          {/* First card */}
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 8 content */}
          </div>

          {/* Second card */}
          <div className="w-[50%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 9 content */}
          </div>

          {/* Right column with 4 stacked cards */}
          <div className="w-[20%] flex flex-col gap-4">
            <div className="h-[25%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 1 */}
            </div>
            <div className="h-[25%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 2 */}
            </div>
            <div className="h-[25%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 3 */}
            </div>
            <div className="h-[25%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 4 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}