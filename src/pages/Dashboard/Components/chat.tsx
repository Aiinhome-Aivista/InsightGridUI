import React, { useState, useEffect } from "react";

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
    question: `Create a stored procedure that returns department, category type, and the item for each category from the product_insights table using the given CASE logic`,
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
  const [chats, setChats] = useState(initialChats);
  const [activeChatId, setActiveChatId] = useState(1);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);

  const handleNewChat = () => {
    const newChatId = chats.length + 1;
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

  const activeChat = chats.find((c) => c.id === activeChatId);

  // When the run button is clicked, show the logs for the active chat.
  const handleRunScript = () => {
    setDisplayedLogs(activeChat?.logs || []);
  };

  // Clear logs when switching to a new chat tab
  useEffect(() => {
    setDisplayedLogs([]);
  }, [activeChatId]);

  return (
    <div className="w-full bg-[#fafafa] flex flex-col font-sans min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-2xl font-semibold text-gray-800 px-8 pt-6">Chat view</h1>
      <p className="text-gray-500 px-8">Ask insight from available table</p>

      {/* Tabs */}
      <div className="flex gap-6 px-8 py-3 border-b bg-white mt-3">
        {chats.map((chat) => (
          <span
            key={chat.id}
            onClick={() => setActiveChatId(chat.id)}
            className={`pb-1 cursor-pointer ${
              activeChatId === chat.id
                ? "text-gray-800 font-semibold border-b-2 border-blue-600"
                : "text-gray-500"
            }`}
          >
            {chat.name}
          </span>
        ))}
        <span
          onClick={handleNewChat}
          className="text-gray-500 cursor-pointer hover:text-blue-600"
        >
          New
        </span>
      </div>

      {/* Chat Prompt */}
      <div className="px-8 py-6 text-gray-700">{activeChat?.question}</div>

      {/* Chat Input Box */}
      <div className="mx-8 border rounded-xl bg-white flex justify-between items-center px-4 py-3 text-gray-500">
        Create a stored procedure that returns department, category type, and the item for each category from the product_insights table using the given CASE logic
        <span className="cursor-pointer text-gray-400 hover:text-gray-700">&#9654;</span>
      </div>

      {/* Script View */}
      <h1 className="text-xl font-semibold text-gray-800 px-8 mt-10">Script view</h1>
      <p className="text-gray-500 px-8 mb-2">Modify and run available script</p>
      
      <div className="mx-8 bg-white border rounded-xl p-6 mb-10 relative">
        <button onClick={handleRunScript} className="absolute right-6 top-6 px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300">
          Run
        </button>

        <pre className="mt-10 whitespace-pre-wrap text-sm text-[#4b4bff] font-mono">
          {activeChat?.query}
        </pre>

        {displayedLogs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm">
            {displayedLogs.map((log, i) => (
              <p key={i} className={log.includes("ERROR") ? "text-red-600" : "text-gray-600"}>
                {log}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
