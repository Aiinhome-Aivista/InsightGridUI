import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ApiServices from "../../../services/ApiServices";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
// Assuming this path is correct based on your component structure
import ProductDataTable from "../Components/DataTable";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ChatSession {
  id: number;
  name: string;
  session_id: string;
  session_name: string;
  file_name: string;
  question: string;
  query: string;
  logs: string[];
  ai_response?: string;
}
interface TableData {
  rows: any[];
  columns: any[];
}

interface TableOption {
  label: string;
  value: string;
}

export default function Chat() {
  const location = useLocation();
  const sessionData = location.state;
  const defaultSession = {
    session_id: sessionData?.sessionId || "",
    session_name: sessionData?.sessionName || "Chat01",
    file_name: sessionData?.fileName || "unknown_file",
  };
  const isSessionDataMissing = !defaultSession.session_id;
  const [chats, setChats] = useState<ChatSession[]>([
    {
      id: 1,
      name: defaultSession.session_name,
      session_id: defaultSession.session_id,
      session_name: defaultSession.session_name,
      file_name: defaultSession.file_name,
      question: isSessionDataMissing ? "FATAL ERROR: Session ID Missing." : "Ask anything about your file…",
      query: "",
      logs: isSessionDataMissing ? ["CRITICAL: Missing session_id. Cannot communicate with API."] : [],
    },
  ]);

  const [activeChatId, setActiveChatId] = useState(1);
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [tableOptions, setTableOptions] = useState<TableOption[]>([]);
  const [typedQuery, setTypedQuery] = useState("");
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const activeChat = chats.find((c) => c.id === activeChatId);
  useEffect(() => {
    
    if (isSessionDataMissing) {
      console.error("API Call skipped: Cannot initialize chat due to missing session_id.");
      setChats(chats => chats.map(chat =>
        chat.id === 1 ? { ...chat, logs: ["CRITICAL: Missing session_id. Cannot communicate with API."] } : chat
      ));
      return;
    }

    const payload = {
      session_id: defaultSession.session_id,
      session_name: defaultSession.session_name,
      file_name: defaultSession.file_name,
      user_query: "Start exploring — type a question about the data!",
    };
    ApiServices.chat(payload)
      .then((response) => {
        if (response.data.isSuccess) {
          const data = response.data.data;
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
    setTypewriterKey(prev => prev + 1);
    setTableData(null);
  };


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


    setIsSending(true);
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
            query: result.ai_response || "",
            ai_response: result.ai_response || "",   // ⭐ store full AI SQL
            logs: result.logs || ["Execution log not available."]
          };
        }
        return chat;
      });


      setChats(updatedChats);
      setDisplayedLogs([]);
      setTypewriterKey(prev => prev + 1);
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
    } finally {
      setIsSending(false);
    }
  };

  // ⭐ Helper to extract pure SQL from the AI response
  const extractSqlQuery = (rawQuery: string): string => {
    if (!rawQuery) {
      return "";
    }

    // The AI can wrap the query in markdown, stored procedures, or add comments.
    // This regex aims to find a `WITH` or `SELECT` statement, which can be inside backticks.
    const queryMatch = rawQuery.match(/(?:WITH|SELECT)[\s\S]*/i);

    if (queryMatch) {
      let query = queryMatch[0];

      // Remove stored procedure definitions if they exist
      query = query.replace(/DELIMITER\s*;;/gi, '')
        .replace(/CREATE\s+PROCEDURE[\s\S]*?BEGIN/gi, '')
        .replace(/END\s*;;/gi, '');

      return query.split(';')[0].trim() + ';';
    }
    return ""; // Return empty if no query is found
  };

  // ⭐ Show Execution Logs
  const handleRunScript = async () => {
    if (!activeChat) {
      setDisplayedLogs(["No active chat session."]);
      return;
    }

    const cleanQuery = activeChat.ai_response?.trim() || "";
    if (!cleanQuery || !activeChat.session_id) {
      setDisplayedLogs(["No script to run."]);
      setTableData(null);
      return;
    }

    setIsExecuting(true); // Start loading
    try {
      const payload = {
        sql_query: cleanQuery
      };

      console.log("Executing SQL Payload:", payload);

      const response = await ApiServices.executeSql(payload);

      if (response.data.isSuccess && Array.isArray(response.data.data)) {
        const rows = response.data.data;
        // If there are rows, derive columns from the keys of the first row object
        const columns = rows.length > 0
          ? Object.keys(rows[0]).map(key => ({ column_name: key }))
          : [];

        setTableData({ rows, columns });
        setDisplayedLogs([response.data.message || "Execution successful."]);
      } else {
        setTableData(null);
        setDisplayedLogs([response.data.message || "Execution failed or returned no data."]);
      }
    } catch (error) {
      console.error("Execute SQL API Error:", error);
      const errorMessage = error.response?.data?.message || "An error occurred while running the script.";
      setDisplayedLogs([`ERROR: ${errorMessage}`]);
      setTableData(null);
    } finally {
      setIsExecuting(false); // Stop loading
    }
  };

  useEffect(() => {
    setDisplayedLogs([]);
    // ⭐ Clear table data when active chat changes
    setTableData(null);
  }, [activeChatId]);

  // Effect to handle the typewriter animation
  useEffect(() => {
    const query = activeChat?.query || '';
    let i = 0;
    setTypedQuery(''); // Clear previous query

    const typingInterval = setInterval(() => {
      if (i < query.length) {
        setTypedQuery(prev => prev + query.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 10); // Typing speed

    return () => {
      clearInterval(typingInterval);
    };
  }, [activeChatId, typewriterKey]); // Rerun when chat changes or message is sent


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
            Ask insight from available table 

            <div className="border-b-2 border-[#D9D9D9] w-[82%] gap-6 flex">
              {chats.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  disabled={isSessionDataMissing} // Disabled when session is missing
                  className={`relative pb-2 pt-1 text-sm tracking-wide transition-colors ${activeChatId === chat.id
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
            placeholder={isSessionDataMissing ? "Cannot send messages due to missing session ID." : "Ask a question to generate a script..."
            }
            disabled={isSessionDataMissing || isSending} // Disabled when session is missing or sending
            className={`w-full h-full bg-transparent outline-none text-sm text-gray-800 ${isSessionDataMissing || isSending ? 'cursor-not-allowed' : ''}`}
          />

          <button
            type="submit"
            disabled={isSessionDataMissing || isSending} // Disabled when session is missing or sending
            className={`p-2 rounded-full hover:bg-gray-100 ${isSessionDataMissing || isSending ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isSending ? (
              <AutorenewRoundedIcon className="w-6 h-6 text-gray-600 animate-spin" />
            ) : (
              <PlayArrowRoundedIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </form>
      </div>

      {/* Script Section */}
      <div className="bg-[#D9D9D91A] p-2 mt-5 rounded-xl">
        <h1 className="text-xl font-semibold text-gray-800 px-8 mt-6">
          Script view
        </h1>
        <p className="text-gray-500 px-8 mb-2">Modify and run available script</p>

        <div className="mx-8 p-6 bg-white shadow-sm mb-10 rounded-xl relative">
          <button
            onClick={handleRunScript}
            disabled={isSessionDataMissing || isExecuting} // Disabled when session is missing or executing
            className={`absolute right-6 top-6 px-4 py-1 bg-gray-200 text-gray-700 text-sm rounded transition-colors ${isSessionDataMissing || isExecuting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
              }`}
          >
            {isExecuting ? "Running..." : "Run"}
          </button>

          <div className="mt-10 text-sm font-mono relative min-h-[150px]">
            {/* This SyntaxHighlighter displays the progressively typed and highlighted query. */}
            <SyntaxHighlighter
              language="sql"
              style={oneLight}
              customStyle={{
                backgroundColor: "transparent",
                padding: 0,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {typedQuery + (typedQuery === (activeChat?.query || '') ? '' : '_')}
            </SyntaxHighlighter>
          </div>

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