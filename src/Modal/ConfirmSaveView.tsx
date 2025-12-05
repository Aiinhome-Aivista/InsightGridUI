// ConfirmSaveView.tsx

import React from "react";

interface ConfirmSaveViewProps {
  viewName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ConfirmSaveView({
  viewName,
  onCancel,
  onConfirm,
}: ConfirmSaveViewProps) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-[550px] bg-[#D9D9D9] rounded-2xl shadow-lg border-[11px] border-white flex flex-col justify-center items-center gap-6 p-8">
        <div className="text-center">
          <p className="text-gray-600 text-lg">View Name</p>
          <h2 className="text-2xl font-semibold text-gray-700">{viewName}</h2>
        </div>

        <p className="text-gray-600 text-xl">
          Are you confirm you want save the view?
        </p>

        <div className="flex gap-4">
          <button
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-[#4B1AE7] hover:text-white transition"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-[#4B1AE7] text-white hover:opacity-90 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
