import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ApiServices from "../../../services/ApiServices";
// Assuming this path is correct based on your component structure
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

// Interface for the table data structure returned by the API
interface TableData {
  rows: any[];
  columns: any[];
}

// Interface for table selection options (based on user's API response logic)
interface TableOption {
    label: string;
    value: string;
}

export default function Chat() {
  // ⭐ Read data passed from UploadPage
  const location = useLocation();
  const sessionData = location.state;

  // Safety check
  const defaultSession = {
    session_id: sessionData?.sessionId || "",
    session_name: sessionData?.sessionName || "Chat01",
    file_name: sessionData?.fileName || "unknown_file",
  };

  // Flag to check for the critical missing data
  const isSessionDataMissing = !defaultSession.session_id;

  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: 1,
      name: defaultSession.session_name,
      session_id: defaultSession.session_id,
      session_name: defaultSession.session_name,
      file_name: defaultSession.file_name,
      // Update initial question based on missing data
      question: isSessionDataMissing ? "FATAL ERROR: Session ID Missing." : "Ask anything about your file…",
      query: "",
      // Update initial logs based on missing data
      logs: isSessionDataMissing ? ["CRITICAL: Missing session_id. Cannot communicate with API."] : [],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  // ⭐ State to store table data (rows and columns)
  const [tableData, setTableData] = useState<TableData | null>(null);
  // ⭐ State to store list of available tables (UI data)
  const [tableOptions, setTableOptions] = useState<TableOption[]>([]); 

  const activeChat = chats.find((c) => c.id === activeChatId);


  // ⭐ EFFECT: Fetch initial UI data (tables list and initial table content)
  useEffect(() => {
    // Check if critical session data is missing
    if (isSessionDataMissing) {
      console.error("API Call skipped: Cannot initialize chat due to missing session_id.");
      // Ensure error log is visible on initial load if missing
      setChats(chats => chats.map(chat => 
        chat.id === 1 ? { ...chat, logs: ["CRITICAL: Missing session_id. Cannot communicate with API."] } : chat
      ));
      return;
    }

    const payload = {
      session_id: defaultSession.session_id,
      // The backend chat endpoint usually requires all three session identifiers
      session_name: defaultSession.session_name,
      file_name: defaultSession.file_name,
      // When calling the 'chat' API for initial data, a default query is required.
      user_query: "What tables are available?", 
    };

    // ⭐ DEBUG: Log initial load payload
    console.log("Sending Initial Load Payload:", payload);

    // The user requested to use the chat API here for initial loading.
    ApiServices.chat(payload)
      .then((response) => {
        if (response.data.isSuccess) {
          const data = response.data.data;
          
          // The chat API returns a SQL query. Let's display it.
          setChats(chats => chats.map(chat => {
            if (chat.id === 1) {
              return {
                ...chat,
                question: data.user_query || payload.user_query,
                query: data.ai_response || "-- No initial query generated.",
                logs: data.logs || [],
              };
            }
            return chat;
          }));
        }
      })
      .catch((error) => console.error("Error fetching initial UI data using chat API:", error));

  }, [defaultSession.session_id, defaultSession.session_name, defaultSession.file_name, isSessionDataMissing]);


  // ⭐ Create new Chat Tab
  const handleNewChat = () => {
    const newChatId = chats.length + 1;

    const newChat: ChatSession = {
      id: newChatId,
      name: `Chat0${newChatId}`,
      session_id: defaultSession.session_id,
      session_name: defaultSession.session_name,
      file_name: defaultSession.file_name,
      // Update new chat creation based on missing data
      question: isSessionDataMissing ? "FATAL ERROR: Session ID Missing." : "Start a new query…",
      query: "",
      logs: isSessionDataMissing ? ["CRITICAL: Missing session_id. Cannot communicate with API."] : [],
    };

    setChats([...chats, newChat]);
    setActiveChatId(newChatId);
    // Clear table data when switching to a new chat
    setTableData(null); 
  };

  // ⭐ Send Message → API Call
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !activeChat) return;
    
    // Check if critical session data is missing before sending a message
    if (!activeChat.session_id || !activeChat.session_name || !activeChat.file_name) {
      
      const missingFields = [];
      if (!activeChat.session_id) missingFields.push("session_id");
      if (!activeChat.session_name) missingFields.push("session_name");
      if (!activeChat.file_name) missingFields.push("file_name");

      console.error(`Cannot send message: Active chat session data is incomplete. Missing: ${missingFields.join(", ")}`);
      
      // Provide user feedback without using alert()
      const errorChat = chats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, logs: [`ERROR: Session data incomplete. Missing fields: ${missingFields.join(", ")}`] }
          : chat
      );
      setChats(errorChat);
      return;
    }


    try {
      const payload = {
        session_id: activeChat.session_id,
        session_name: activeChat.session_name,
        file_name: activeChat.file_name,
        user_query: inputValue,
      };

      // ⭐ DEBUG: Log the payload to check for empty or null values
      console.log("Sending Chat Payload:", payload); 

      // API call to ApiServices.chat(payload)
      const response = await ApiServices.chat(payload);
      const result = response.data?.data || {};

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChatId) {
          return {
            ...chat,
            question: result.user_query || inputValue,
            query: result.ai_response || "-- No SQL generated",
            logs: result.logs || ["Execution log not available."],
          };
        }
        return chat;
      });

      setChats(updatedChats);
      setDisplayedLogs([]);
      setInputValue("");
      
      // ⭐ Set Table Data from API response
      if (result.rows && result.columns) {
        setTableData({ rows: result.rows, columns: result.columns });
      } else {
        setTableData(null); // Clear table if no data is returned
      }

    } catch (error) {
      console.error("Chat API Error:", error);

      const updatedChats = chats.map((chat) =>
        chat.id === activeChatId
          ? { ...chat, logs: ["ERROR: Something went wrong while calling API."] }
          : chat
      );

      setChats(updatedChats);
      setTableData(null); // Clear table on error
    }
  };

  // ⭐ Show Execution Logs
  const handleRunScript = () => {
    setDisplayedLogs(activeChat?.logs || []);
  };

  useEffect(() => {
    setDisplayedLogs([]);
    // ⭐ Clear table data when active chat changes
    setTableData(null); 
  }, [activeChatId]);

  return (
    <div className="w-full min-h-screen px-5 mt-5">
      
      {/* ⭐ CRITICAL ERROR MESSAGE (Replaces the yellow debug banner) */}
      {isSessionDataMissing && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-md" role="alert">
          <p className="font-bold">CRITICAL ERROR: Session Data Missing</p>
          <p>The **session\_id** was not passed correctly from the previous page (Upload). This prevents all communication with the backend AI service.</p>
          <p className="mt-2 text-sm italic">Action Required: Please navigate back to the Upload page and ensure a file is processed successfully before proceeding here.</p>
        </div>
      )}

      {/* Chat Header */}
      <div className="pb-2 bg-[#D9D9D91A] rounded-xl">
        <div className="px-8 pt-4">
          <h1 className="text-xl font-semibold text-gray-800">Chat view</h1>
          <div className="text-gray-500 text-sm flex flex-row items-center gap-6 border-gray-200">
            Ask insight from available table (Tables Loaded: {tableOptions.length})

            <div className="border-b-2 border-[#D9D9D9] w-[82%] gap-6 flex">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  disabled={isSessionDataMissing} // Disabled when session is missing
                  className={`relative pb-2 pt-1 text-sm tracking-wide transition-colors ${
                    activeChatId === chat.id
                      ? "text-[#6A1B9A] font-medium"
                      : "text-gray-500 hover:text-[#6A1B9A]"
                  } ${isSessionDataMissing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {chat.name}

                  {activeChatId === chat.id && (
                    <span className="absolute left-0 right-0 -bottom-0.5 h-[3px] bg-[#6A1B9A] rounded"></span>
                  )}
                </button>
              ))}

              <button
                onClick={handleNewChat}
                disabled={isSessionDataMissing} // Disabled when session is missing
                className={`pb-2 pt-1 text-sm text-gray-500 hover:text-[#6A1B9A] transition-colors ${isSessionDataMissing ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            placeholder={isSessionDataMissing ? "Cannot send messages due to missing session ID." : "Ask a question to generate a script..."}
            disabled={isSessionDataMissing} // Disabled when session is missing
            className={`w-full h-full bg-transparent outline-none text-sm text-gray-800 ${isSessionDataMissing ? 'cursor-not-allowed' : ''}`}
          />

          <button 
            type="submit" 
            disabled={isSessionDataMissing} // Disabled when session is missing
            className={`p-2 rounded-full hover:bg-gray-100 ${isSessionDataMissing ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
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
            disabled={isSessionDataMissing} // Disabled when session is missing
            className={`absolute right-6 top-6 px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 ${isSessionDataMissing ? 'opacity-50 cursor-not-allowed' : ''}`}
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

        {/* ⭐ Data Table Section */}
        <div className="mb-10 px-6">
          {tableData && tableData.rows.length > 0 && (
            <div className="p-2 bg-white rounded-xl shadow-md">
                <ProductDataTable 
                  data={tableData.rows}
                  columns={tableData.columns} 
                  globalFilter={""}
                />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}