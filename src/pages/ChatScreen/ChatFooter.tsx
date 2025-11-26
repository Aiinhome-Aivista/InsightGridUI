// src/components/InsightGridChat/ChatFooter.tsx
import React from "react";

export default function ChatFooter() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-t bg-white">

      <div className="text-gray-600 max-w-md text-[8px] leading-[15px]">
        <p>Add a new column by defining its name and type. It will appear instantly in your table.</p>
        <p>Use this section to create custom columns that help structure your data better.</p>
        <p>Enter the details of the column you want to add, and it will be added to your dataset.</p>
      </div>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 rounded-md border text-sm">Reset</button>
        <button className="px-4 py-2 rounded-md bg-violet-600 text-white text-sm">
          Save
        </button>
      </div>
    </div>
  );
}
