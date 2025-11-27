// src/components/InsightGridChat/InsightGridChat.tsx
import React, { useEffect, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatBody from "./ChatBody";
import ChatSidebar from "./ChatSidebar";
import ChatFooter from "./ChatFooter";

interface InsightGridChatProps {
  onClose: () => void;
}

export default function InsightGridChat({ onClose }: InsightGridChatProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.querySelector("header")?.classList.add("hidden");
    document.querySelector("footer")?.classList.add("hidden");
    document.querySelector("aside")?.classList.add("hidden");

    return () => {
      document.body.style.overflow = "auto";
      document.querySelector("header")?.classList.remove("hidden");
      document.querySelector("footer")?.classList.remove("hidden");
      document.querySelector("aside")?.classList.remove("hidden");
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">

      {/* MAIN AREA */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT (80%) */}
        <div className="w-4/5 flex flex-col">
          <ChatHeader onClose={onClose} />

          <div className="flex-1 px-10 py-8 overflow-auto">
            <ChatBody />
          </div>
        </div>

        {/* DIVIDER */}
        <div className="w-px bg-gray-200"></div>

        {/* RIGHT SIDEBAR (20%) */}
        <ChatSidebar selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
      </div>

      {/* FOOTER */}
      <ChatFooter />
    </div>
  );
}
