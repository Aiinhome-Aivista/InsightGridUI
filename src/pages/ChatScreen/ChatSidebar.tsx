import React from "react";

interface ChatSidebarProps {
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
}

export default function ChatSidebar({
  selectedIndex,
  setSelectedIndex,
}: ChatSidebarProps) {

  const items = [
    "AI-Based Category Insights Request",
    "Product Data Classification Query",
    "Department-Wise Summary Analysis",
    "Smart Inventory Categorization Chat",
    "Dynamic Database Categorization Assistant",
  ];

  return (
    <div className="w-1/5 bg-white overflow-y-auto border-l flex flex-col">

      {/* Collection Label */}
      <div className="px-6 pt-4 pb-3 text-sm text-gray-600">
        Collection
      </div>

      {/* List Items */}
      <ul className="px-4 space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className={`p-2 rounded-md text-sm cursor-pointer transition-all
              ${
                selectedIndex === idx
                  ? "bg-violet-50 text-violet-700"
                  : "text-gray-700 hover:bg-gray-100"
              }
            `}
          >
            {item}
          </li>
        ))}
      </ul>

    </div>
  );
}
