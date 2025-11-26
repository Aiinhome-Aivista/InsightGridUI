// src/components/InsightGridChat/ChatHeader.tsx
import React from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import SearchTwoToneIcon from '@mui/icons-material/SearchTwoTone';

interface ChatHeaderProps {
  onClose: () => void;
}

export default function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="w-full flex items-start gap-4 mt-6 px-10">

      {/* Back + Title */}
      <div className="flex items-start gap-2">
        <button
          onClick={onClose}
          className="p-1 pl-[6px] rounded-full hover:bg-gray-200 flex items-center"
        >
          <KeyboardBackspaceIcon fontSize="small" />
        </button>

        <div className="flex items-start gap-1">
          <QuestionAnswerIcon fontSize="small" />
          <span className="font-semibold text-sm">InsightGrid Chat</span>
        </div>
      </div>

      {/* Name Input */}
      <input
        type="text"
        placeholder="Name the Collection"
        className="flex-[28] h-9 px-3 rounded-md border border-gray-300 text-sm bg-gray-50 outline-none"
      />

      {/* Search Input */}
      <div className="relative flex-[12]">
        <SearchTwoToneIcon fontSize="small" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search Collection"
          className="w-full h-9 px-3 pl-9 rounded-md border border-gray-300 text-sm bg-gray-50 outline-none"
        />
      </div>
    </div>
  );
}
