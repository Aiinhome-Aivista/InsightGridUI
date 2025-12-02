import React, { useState } from "react";

interface ChatSession {
  id: number;
  name: string;
  question: string;
  query: string;
  logs: string[];
}

const initialChats: ChatSession[] = [
  {
    id: 1,
    name: "Chat01",
    question: `Hi, I’m reviewing our product data today. Can you create a Store Procedure
        for <span class="text-blue-600 font-semibold">@categorized</span>{" "}
        summary of the items based on their{" "}
        <span class="text-blue-600 font-semibold">@department</span> and{" "}
        <span class="text-blue-600 font-semibold">@popularity</span>?`,
    query: `DELIMITER $$

CREATE PROCEDURE GetProductInsights()
BEGIN
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
END $$

DELIMITER ;`,
    logs: [
      "1. Operation completed successfully.",
      "2. Data fetched successfully.",
      "3. ERROR 1054: Unknown column 'userName' in 'field list'",
    ],
  },
];

export default function Chat() {
  const [chats, setChats] = useState<ChatSession[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<number>(1);

  const handleNewChat = () => {
    const newChatId = chats.length > 0 ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    const newChat: ChatSession = {
      id: newChatId,
      name: `Chat0${newChatId}`,
      question: "New chat session. What would you like to do?",
      query: "-- Start writing your SQL query here",
      logs: ["New chat created."],
    };
    setChats([...chats, newChat]);
    setActiveChatId(newChatId);
  };

  const activeChat = chats.find(c => c.id === activeChatId);

  return (
    <div className="w-full h-full bg-[#fafafa] flex flex-col font-sans">
      {/* Tabs */}
      <div className="flex gap-6 px-8 py-4 border-b bg-white">
        {chats.map(chat => (
          <span
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`pb-1 cursor-pointer ${activeChatId === chat.id
                ? "text-gray-800 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
              }`}
          >
            {chat.name}
          </span>
        ))}
        <span onClick={handleNewChat} className="text-gray-500 cursor-pointer hover:text-blue-600">New</span>
      </div>

      {activeChat ? (
        <>
          {/* Heading */}
          <div className="px-8 py-5 text-gray-700" dangerouslySetInnerHTML={{ __html: activeChat.question }} />

          {/* Editor Container */}
          <div className="mx-8 mb-8 bg-white border rounded-xl shadow-sm p-6 overflow-y-auto">
            {/* Run Button */}
            <button className="float-right px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
              Run
            </button>

            {/* SQL Text */}
            <pre className="whitespace-pre-wrap text-sm text-[#4b4bff] font-mono mt-10">
              {activeChat.query}
            </pre>

            {/* Logs */}
            <div className="mt-6 space-y-2 text-sm">
              {activeChat.logs.map((log, i) => (
                <p
                  key={i}
                  className={
                    log.includes("ERROR") ? "text-red-600" : "text-gray-600"
                  }
                >
                  {log}
                </p>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="p-8 text-gray-600">No active chat selected.</div>
      )}
    </div>

  );
};
