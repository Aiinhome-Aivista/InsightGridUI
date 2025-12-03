import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ApiServices from "../../../services/ApiServices";
import ProductDataTable from "../Components/DataTable";

interface ChatSession {
  id: number;
  name: string;
  session_id: string;
  session_name: string;
  file_name: string;
  question: string;
  query: string;
  logs: string[];
}

export default function Chat() {
  // ⭐ Read data passed from UploadPage
  const location = useLocation();
  const sessionData = location.state;

  // Safety check
  const defaultSession = {
    session_id: sessionData?.session_id || "",
    session_name: sessionData?.session_name || "Chat01",
    file_name: sessionData?.file_name || "unknown_file"
  };

  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: 1,
      name: defaultSession.session_name,
      session_id: defaultSession.session_id,
      session_name: defaultSession.session_name,
      file_name: defaultSession.file_name,
      question: "Ask anything about your file…",
      query: "",
      logs: []
    }
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  const activeChat = chats.find((c) => c.id === activeChatId);

  // ⭐ Create new Chat Tab
  const handleNewChat = () => {
    const newChatId = chats.length + 1;

    const newChat: ChatSession = {
      id: newChatId,
      name: `Chat0${newChatId}`,
      session_id: defaultSession.session_id,
      session_name: defaultSession.session_name,
      file_name: defaultSession.file_name,
      question: "Start a new query…",
      query: "",
      logs: []
    };

    setChats([...chats, newChat]);
    setActiveChatId(newChatId);
  };

  // ⭐ Send Message → API Call
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChat) return;

    try {
      const payload = {
        session_id: activeChat.session_id,
        session_name: activeChat.session_name,
        file_name: activeChat.file_name,
        user_query: inputValue
      };

      const response = await ApiServices.chat(payload);
      const result = response.data?.data || {};

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            question: result.answer || "No response",
            query: result.generated_sql || "-- No SQL generated",
            logs: result.logs || []
          };
        }
        return chat;
      });

      setChats(updatedChats);
      setDisplayedLogs([]);
      setInputValue("");

    } catch (error) {
      console.error("Chat API Error:", error);

      const updatedChats = chats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, logs: ["ERROR: Something went wrong while calling API."] }
          : chat
      );

      setChats(updatedChats);
    }
  };

  // ⭐ Show Execution Logs
  const handleRunScript = () => {
    setDisplayedLogs(activeChat?.logs || []);
  };

  useEffect(() => {
    setDisplayedLogs([]);
  }, [activeChatId]);

  return (
    <div className="w-full min-h-screen px-5 mt-5">

      {/* Chat Header */}
      <div className="pb-2 bg-[#D9D9D91A] rounded-xl">
        <div className="px-8 pt-4">
          <h1 className="text-xl font-semibold text-gray-800">Chat view</h1>
          <div className="text-gray-500 text-sm flex flex-row items-center gap-6 border-gray-200">
            Ask insight from available table

            <div className="border-b-2 border-[#D9D9D9] w-[82%] gap-6 flex">
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

                  {activeChatId === chat.id && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] bg-[#6A1B9A] rounded"></span>
                  )}
                </button>
              ))}

              <button
                onClick={handleNewChat}
                className="pb-2 pt-1 text-sm text-gray-500 hover:text-[#6A1B9A] transition-colors"
              >
                New
              </button>
            </div>
          </div>
        </div>

        {/* Chat Box */}
        <div className="px-8 py-6 text-gray-700 whitespace-pre-line flex items-start gap-2">
          <span>{activeChat?.question}</span>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="mx-8 border rounded-xl flex justify-between items-center px-4 py-2 mt-20 text-gray-500 bg-white"
        >
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

      {/* Script Section */}
      <div className="bg-[#D9D9D91A] p-2 mt-5 rounded-xl">
        <h1 className="text-xl font-semibold text-gray-800 px-8 mt-6">
          Script view
        </h1>
        <p className="text-gray-500 px-8 mb-2">Modify and run available script</p>

        <div className="mx-8 p-4 bg-white shadow-sm mb-10 rounded-xl relative">
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
