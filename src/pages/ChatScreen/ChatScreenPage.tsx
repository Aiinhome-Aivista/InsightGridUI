// Updated React Chat UI component
import React, { useEffect, useState } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone';

interface InsightGridChatUIProps {
  onClose: () => void;
}

export default function InsightGridChatUI({ onClose }: InsightGridChatUIProps): JSX.Element {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim() === "") return;
    console.log("Send message:", message);
    setMessage("");
  };

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
    <div className="w-full h-screen bg-white flex flex-col overflow-hidden font-sans text-gray-700">

      {/* HEADER */}
<div className="flex items-center gap-3 px-4 py-3 bg-white">
  <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200">
    <KeyboardBackspaceIcon />
  </button>

  <div className="flex items-center gap-2">
    <QuestionAnswerIcon />
    <div className="font-semibold text-sm">InsightGrid Chat</div>
  </div>

  <input
    type="text"
    placeholder="Name the Collection"
    className="ml-6 w-[625px] h-9 px-3 rounded-md border border-gray-300 text-sm bg-gray-50 outline-none"
  />

  <div className="relative w-[385px]">
    <input
      type="text"
      placeholder="Search Collection"
      className="pl-9 w-full h-9 px-2 rounded-md border border-gray-300 text-sm bg-gray-50 outline-none"
    />
  </div>
</div>

      {/* BODY */}
      <div className="flex flex-1 overflow-hidden">

        {/* LEFT CHAT PANEL */}
        <section className="flex-1 flex flex-col p-5 mx-5 my-4 border-2 border-violet-200 rounded-xl overflow-hidden">

          <div className="text-sm text-gray-600 mb-3">Chat</div>

          <div className="flex-1 overflow-auto pr-2">

            {/* USER MESSAGE */}
            <div className="flex justify-end mb-4">
              <div className="max-w-[680px] bg-white border border-gray-200 rounded-md p-3 text-sm">
                Hi, I'm reviewing our product data today. Can you show me a <span className="text-violet-600">@categorized</span> summary?
              </div>
            </div>

            {/* SCRIPT BLOCK */}
            <div className="relative max-w-[700px] bg-gray-100 rounded-md p-4 text-sm mb-4 border border-gray-200">

                      {/* NEW ASSISTANT HEADER LINE */}
            <div className="text-gray-800 text-sm mb-2 font-medium">
              Sure! Here’s a categorized overview based on your data:
            </div>

              <div className="absolute right-3 top-3 flex items-center gap-2">
                            <button
              onClick={() => alert("Open script page...")}
              className="block w-fit bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full mb-3"
            >
              Script
            </button>
                <button className=" hover:bg-gray-300 text-gray-700 text-xs px-3 py-1 rounded-full mb-3">
                  <ContentCopyTwoToneIcon style={{ fontSize: "16px", color: "#555" }} />
                </button>
              </div>

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

            <div style={{ height: 80 }} />

          </div>

          {/* INPUT (NO BUTTON COLOR, NO ICON) */}
          <div className="mt-3">
           <div className="relative w-full">
  <input
    className="flex-1 h-10 w-full pl-3 pr-10 rounded-md border border-gray-300 text-sm"
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    placeholder="Type your message..."
  />

  {/* Button inside input */}
  <button
    onClick={handleSend}
    className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
  >
    <PlayArrowTwoToneIcon className="text-gray-600" />
  </button>
</div>


            <div className="text-xs text-gray-400 mt-2">*Please add a table name (#) and column (@)</div>
          </div>
        </section>

        {/* RIGHT COLLECTION PANEL */}
        <aside className="w-64 px-5 py-2 bg-white overflow-hidden">
          <div className="text-sm text-gray-600 mb-2">Collection</div>

          <ul className="space-y-2">
            {["AI-Based Category Insights Request", "Product Data Classification Query", "Department Summary", "Inventory Categorization", "Dynamic Categorization Assistant"].map((item, idx) => (
              <li key={idx} className={`p-2 rounded-md text-sm ${idx === 0 ? "bg-violet-50 text-violet-700" : "hover:bg-gray-100 text-gray-700"}`}>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {/* FOOTER */}
<div className="flex items-center justify-between px-6 py-4 border-t bg-white">

  {/* LEFT SIDE TEXT */}
<div className="text-gray-600 max-w-md text-[8px] font-normal leading-[15px] font-inter">
  <p>Add a new column by defining its name and type. It will appear instantly in your table.</p>
  <p>Use this section to create custom columns that help structure your data better.</p>
  <p>Enter the details of the column you want to add, and it will be added to your dataset.</p>
</div>

  {/* RIGHT SIDE BUTTONS */}
  <div className="flex items-center gap-3">
    <button className="px-4 py-2 rounded-md border text-sm">Reset</button>
    <button className="px-4 py-2 rounded-md bg-violet-600 text-white text-sm">Save</button>
  </div>

</div>

    </div>
  );
}