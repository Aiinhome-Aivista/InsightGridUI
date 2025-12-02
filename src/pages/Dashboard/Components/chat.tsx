import React, { useState, useEffect } from "react";
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ProductDataTable from "../Components/DataTable";
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
    question: `Create a stored procedure that returns department, category type, and the item for each category from the product_insights table using the given CASE logic.

    Sure! Here is the stored procedure based on your query.`,
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
  const [inputValue, setInputValue] = useState("");

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

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChat) return;

    const updatedChats = chats.map(chat => {
      if (chat.id === activeChatId) {
        // For this simulation, we'll just replace the question.
        // In a real app, you might append to a conversation history.
        return {
          ...chat,
          question: inputValue,
          query: "-- SQL will be generated based on your question.",
          logs: [] // Clear previous logs
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setInputValue(""); // Clear the input box
  };

  // When the run button is clicked, show the logs for the active chat.
  const handleRunScript = () => {
    setDisplayedLogs(activeChat?.logs || []);
  };

  // Clear logs when switching to a new chat tab
  useEffect(() => {
    setDisplayedLogs([]);
  }, [activeChatId]);

  return (
    <div className="w-full min-h-screen">
   <div className="pb-1 bg-[#D9D9D91A]">
  <div className="px-8 pt-4">
    <h1 className="text-xl font-semibold text-gray-800">Chat view</h1>
    <div className="text-gray-500 text-sm flex flex-row items-center gap-6 border-gray-200 h-11">
      Ask insight from available table
  {/* <div className="flex items-center gap-6 px-8 border-gray-200 h-11"> */}
  {chats.map((chat) => (
    <button
      key={chat.id}
      onClick={() => setActiveChatId(chat.id)}
      className={`relative pb-2 pt-1 text-sm tracking-wide transition-colors ${
        activeChatId === chat.id
          ? "text-[#6A1B9A] font-medium"
          : "text-gray-500 hover:text-[#6A1B9A]"
      }`}
    >
      {chat.name}

      {/* ACTIVE UNDERLINE */}
      {activeChatId === chat.id && (
        <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] bg-[#6A1B9A] rounded"></span>
      )}
    </button>
  ))}

  {/* NEW TAB BUTTON */}
  <button
    onClick={handleNewChat}
    className="pb-2 pt-1 text-sm text-gray-500 hover:text-[#6A1B9A] transition-colors"
  >
    New
  </button>
</div>
</div> 
      {/* Chat Prompt */}
      <div className="px-8 py-6 text-gray-700 whitespace-pre-line flex items-start gap-2">
        <span>{activeChat?.question}</span>
       
      </div>

      {/* Chat Input Box */}
      <form onSubmit={handleSendMessage} className="mx-8 border rounded-xl flex justify-between items-center px-4 py-2 mt-20 text-gray-500 bg-white">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask a question to generate a script..."
          className="w-full h-full bg-transparent outline-none text-sm text-gray-800"
        />
        <button type="submit" className="p-2 rounded-full hover:bg-gray-100">
          <PlayArrowRoundedIcon className="w-6 h-6 text-gray-600" />
        </button>
      </form>
      </div>

    <div className="bg-[#D9D9D91A] shadow-sm p-2">
      <h1 className="text-xl font-semibold text-gray-800 px-8 mt-10">
        Script view
      </h1>
      <p className="text-gray-500 px-8 mb-2">Modify and run available script</p>

      <div className="mx-8 p-4 bg-[#FFFFFF] shadow-sm mb-10 relative">
        <button
          onClick={handleRunScript}
          className="absolute right-6 top-6 px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
        >
          Run
        </button>

        <pre className="mt-10 whitespace-pre-wrap text-sm text-[#4b4bff] font-mono">
          {activeChat?.query}
        </pre>

        {displayedLogs.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm -mx-6 px-6">
            {displayedLogs.map((log, i) => (
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
        )}
      </div>
      <div className="mb-10 px-6">
           <ProductDataTable data={[]} globalFilter="" />
 </div>
 </div>
    </div>
  );
}
