import React, { useState,useEffect } from "react";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import PlayArrowTwoToneIcon from "@mui/icons-material/PlayArrowTwoTone";
import hljs from "highlight.js";
import "highlight.js/styles/stackoverflow-light.min.css";




export default function ChatBody() {
  const [message, setMessage] = useState("");
  const [showScript, setShowScript] = useState(false); 
  const [copyActive, setCopyActive] = useState(false);

  const scriptText = `
SELECT 
    department,
    CASE 
        WHEN category_type = 'Most Viewed' THEN item
        WHEN category_type = 'Most Purchased' THEN item
        WHEN category_type = 'Trending' THEN item
        WHEN category_type = 'Low Stock' THEN item
    END AS category_item,
    category_type
FROM product_insights;
  `;

  const handleSend = () => {
    if (!message.trim()) return;
    setMessage("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(scriptText);
    setShowScript(true); // also open script
    setCopyActive(true);

    setTimeout(() => setCopyActive(false), 1000);
  };
  useEffect(() => {
  if (showScript) {
    setTimeout(() => {
      document.querySelectorAll("pre.sql-code").forEach((block: any) => {
        hljs.highlightElement(block);
      });
    }, 50);
  }
}, [showScript]);


  return (
    <section className="w-full h-full flex flex-col border-2 border-violet-200 rounded-xl overflow-hidden">

      {/* Title */}
      <div className="text-sm text-gray-600 px-5 pt-4 pb-2">Chat</div>

      {/* Scrollable Area */}
      <div className="flex-1 px-5 overflow-y-auto space-y-4 pb-4">

        {/* User Message */}
        <div className="flex justify-end">
          <div className="max-w-[680px] bg-white border border-gray-200 rounded-md p-3 text-sm">
            Hi, I'm reviewing our product data today. Can you show me a{" "}
            <span className="text-violet-600">@categorized</span> summary?
          </div>
        </div>

        {/* Response Block */}
{/* Assistant Response Block */}
<div className="relative max-w-[700px] bg-gray-100 rounded-md p-4 text-sm border border-gray-200">
  <div className="text-gray-800 text-sm mb-2 font-medium">
    Sure! Here’s a categorized overview based on your data:
  </div>

  {/* Buttons */}
  <div className="absolute right-3 top-3 flex items-center gap-2">

    {/* Script Button */}
    <button
      onClick={() => setShowScript(true)}
      className={`text-xs px-3 py-1 rounded-full 
      ${showScript ? "bg-violet-200 text-violet-700" : "bg-gray-200 text-gray-700"} 
      hover:bg-gray-300`}
    >
      Script
    </button>

    {/* Copy Button */}
    <button
      onClick={handleCopy}
      className={`text-xs px-2 py-1 rounded-full 
      ${copyActive ? "bg-violet-200" : "hover:bg-gray-300"} text-gray-700`}
    >
      <ContentCopyTwoToneIcon style={{ fontSize: 16 }} />
    </button>
  </div>

  {/* NORMAL STATIC CONTENT — ALWAYS VISIBLE */}
  <pre className="whitespace-pre-wrap text-sm leading-5 mt-6">
Department: Electronics
Most Viewed: Smartphones
Trending: Wireless Earbuds
Low Stock: Smartwatches

Department: Home & Kitchen
Most Purchased: Mixer Grinders
Trending: Air Fryers
Low Stock: Water Purifiers

Department: Fashion
Most Viewed: Men's Sneakers
Trending: Oversized T-Shirts
Low Stock: Women's Handbags
  </pre>
</div>

{/* NEW SCRIPT BLOCK BELOW — DOES NOT REPLACE ANYTHING */}
{showScript && (
  <div className="relative max-w-[700px] bg-gray-100 rounded-md p-4 text-sm border border-gray-200">
      {/* Buttons */}
  <div className="absolute right-3 top-3 flex items-center gap-2">

    {/* Copy Button */}
    <button
      onClick={handleCopy}
      className={`text-xs px-2 py-1 rounded-full 
      ${copyActive ? "bg-violet-200" : "hover:bg-gray-300"} text-gray-700`}
    >
      <ContentCopyTwoToneIcon style={{ fontSize: 16 }} />
    </button>
  </div>
    <pre className="sql-code text-sm overflow-auto">
      <code className="language-sql">
{`
SELECT 
    department,
    CASE 
        WHEN category_type = 'Most Viewed' THEN item
        WHEN category_type = 'Most Purchased' THEN item
        WHEN category_type = 'Trending' THEN item
        WHEN category_type = 'Low Stock' THEN item
    END AS category_item,
    category_type
FROM product_insights;
`}
      </code>
    </pre>
  </div>
)}



      </div>

      {/* Input Box */}
      <div className="p-5 border-t bg-white">
        <div className="relative w-full">
          <input
            className="flex-1 h-10 w-full pl-3 pr-10 rounded-md border border-gray-300 text-sm"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />

          <button
            onClick={handleSend}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
          >
            <PlayArrowTwoToneIcon className="text-gray-600" />
          </button>
        </div>

        <div className="text-xs text-gray-400 mt-2">
          *Please add a table name (#) and column (@)
        </div>
      </div>

    </section>
  );
}
