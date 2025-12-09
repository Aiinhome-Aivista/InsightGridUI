import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import ApiService from "../../../services/ApiServices";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ProductDataTable from "./DataTable";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useAuth } from "../../Auth/AuthContext";
import ConfirmSaveView from "../../../Modal/ConfirmSaveView";

interface ChatSession {
  id: number;
  session_id: string;
  session_name: string; // Re-enabled session_name
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
  const { user } = useAuth();
  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("ig_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };
  const sessionData = getStoredUser();
  const defaultSession = {
    session_id: sessionData?.session_id || "",
    session_name: sessionData?.session_name || "Chat01", // Re-enabled session_name
  };
  const isSessionDataMissing = !defaultSession.session_id;
  const [chat, setChat] = useState<ChatSession>({
    id: 1,
    session_id: defaultSession.session_id,
    session_name: defaultSession.session_name, // Re-enabled session_name
    question: isSessionDataMissing
      ? "FATAL ERROR: Session ID Missing."
      : "Ask anything about your file…",
    query: "",
    logs: isSessionDataMissing
      ? ["CRITICAL: Missing session_id. Cannot communicate with API."]
      : [],
    file_name: "",
  });
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [typedQuery, setTypedQuery] = useState("");
  const [typewriterKey, setTypewriterKey] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isScriptRunSuccess, setIsScriptRunSuccess] = useState(false);
  const [executionMeta, setExecutionMeta] = useState<{ rows_effected?: number | string; query_time?: string } | null>(null);
  const userData = JSON.parse(localStorage.getItem("ig_user"));
  const {
    setIsConfirmSaveModalOpen,
    viewName,
    setViewName,
    setConfirmSaveAction,
  } = useAuth();

  useEffect(() => {
    if (isSessionDataMissing) {
      console.error(
        "API Call skipped: Cannot initialize chat due to missing session_id."
      );
      setChat((prevChat) => ({
        ...prevChat,
        logs: ["CRITICAL: Missing session_id. Cannot communicate with API."],
      }));
      return;
    }

    const payload = {
      session_id: defaultSession.session_id,
      session_name: defaultSession.session_name, // Re-enabled session_name
      user_query: " Hello, how can I help you?",
    };
    ApiService.chat(payload)
      .then((response) => {
        if (response.data.isSuccess) {
          const data = response.data.data;
          setChat((prevChat) => ({
            ...prevChat,
            question: data.user_query || payload.user_query,
            query: data.ai_response || "-- No initial query generated.",
            logs: data.logs || [],
          }));
        }
      })
      .catch((error) =>
        console.error("Error fetching initial UI data using chat API:", error)
      );
  }, [defaultSession.session_id, isSessionDataMissing]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chat) return;
    if (!chat.session_id || !chat.session_name) {
      const missingFields = [];
      if (!chat.session_id) missingFields.push("session_id");
      if (!chat.session_name) missingFields.push("session_name");

      console.error(
        `Cannot send message: Active chat session data is incomplete. Missing: ${missingFields.join(
          ", "
        )}`
      );
      setChat((prevChat) => ({
        ...prevChat,
        logs: [
          `ERROR: Session data incomplete. Missing fields: ${missingFields.join(
            ", "
          )}`,
        ],
      }));
      return;
    }

    setIsSending(true);
    try {
      const payload = {
        session_id: chat.session_id,
        session_name: chat.session_name, // Re-enabled session_name
        created_by: userData?.user_id || "unknown",
        user_query: inputValue,
      };
      console.log("Sending Chat Payload:", payload);

      const response = await ApiService.chat(payload);
      const result = response.data?.data || {};

      setChat((prevChat) => ({
        ...prevChat,
        question: result.user_query || inputValue,
        query: result.ai_response || "",
        ai_response: result.ai_response || "",
        logs: result.logs || ["Execution log not available."],
      }));
      setDisplayedLogs([]);
      setTypewriterKey((prev) => prev + 1);
      setInputValue("");
      setTableData(null); // Clear the local table on new query
      setIsScriptRunSuccess(false);
    } catch (error) {
      console.error("Chat API Error:", error);

      setChat((prevChat) => ({
        ...prevChat,
        logs: ["ERROR: Something went wrong while calling API."],
      }));
      setIsScriptRunSuccess(false);
    } finally {
      setIsSending(false);
    }
  };
  const extractSqlQuery = (rawQuery: string): string => {
    if (!rawQuery) {
      return "";
    }
    const queryMatch = rawQuery.match(/(?:WITH|SELECT)[\s\S]*/i);

    if (queryMatch) {
      let query = queryMatch[0];

      // Remove stored procedure definitions if they exist
      query = query
        .replace(/DELIMITER\s*;;/gi, "")
        .replace(/CREATE\s+PROCEDURE[\s\S]*?BEGIN/gi, "")
        .replace(/END\s*;;/gi, "");

      return query.split(";")[0].trim() + ";";
    }
    return ""; // Return empty if no query is found
  };
  const handleRunScript = async () => {
    if (!chat) {
      setDisplayedLogs(["No active chat session."]);
      return;
    }

    const executableQuery = extractSqlQuery(chat.query?.trim() || ""); // Extract clean query for execution
    if (!executableQuery || !chat.session_id) {
      setDisplayedLogs(["No script to run."]);
      setTableData(null);
      setIsScriptRunSuccess(false);
      return;
    }

    setIsExecuting(true); // Start loading
    try {
      const payload = {
        sql_query: executableQuery, // Use the extracted query
      };

      console.log("Executing SQL Payload:", payload);

      const response = await ApiService.executeSql(payload);

      if (
        response.data.isSuccess &&
        response.data.data &&
        Array.isArray(response.data.data.rows)
      ) {
        const rows = response.data.data.rows;
        // If there are rows, derive columns from the keys of the first row object
        const columns =
          rows.length > 0
            ? Object.keys(rows[0]).map((key) => ({ column_name: key }))
            : [];

        setTableData({ rows, columns });
        setDisplayedLogs([response.data.message || "Execution successful."]);
        // capture execution metadata if provided by backend
        setExecutionMeta({
          rows_effected: response.data.data.total_rows ?? rows.length,
          query_time: response.data.data.execution_time ?? "",
        });
        setIsScriptRunSuccess(true);
      } else {
        setTableData(null);
        setDisplayedLogs([
          response.data.message || "Execution failed or returned no data.",
        ]);
        setExecutionMeta(null);
        setIsScriptRunSuccess(false);
      }
    } catch (error) {
      console.error("Execute SQL API Error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while running the script.";
      setDisplayedLogs([`ERROR: ${errorMessage}`]);
      setTableData(null);
      setExecutionMeta(null);
      setIsScriptRunSuccess(false);
    } finally {
      setIsExecuting(false); // Stop loading
    }
  };

  useEffect(() => {
    const query = chat?.query || "";
    let i = 0;
    setTypedQuery(""); // Clear previous query
    const scriptContainerRef = document.getElementById("script-container");

    const typingInterval = setInterval(() => {
      if (i < query.length) {
        setTypedQuery((prev) => prev + query.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
      if (scriptContainerRef) {
        scriptContainerRef.scrollTop = scriptContainerRef.scrollHeight;
      }
    }, 10); // Typing speed

    return () => {
      clearInterval(typingInterval);
    };
  }, [chat, typewriterKey]); // Rerun when chat changes or message is sent

  useEffect(() => {
    setConfirmSaveAction(() => handleConfirmSave);
  }, [chat, viewName, isScriptRunSuccess, tableData]);


  const handleConfirmSave = async () => {
    if (!chat || !viewName.trim()) return;

    const payload = {
      user_query: chat.question,
      is_execute: isScriptRunSuccess ? 1 : 0,
      ai_response: chat.ai_response || "",
      created_by: userData?.user_id || "unknown",
      // row_data: tableData || null,
      session_id: chat.session_id,
      rows_effected: executionMeta?.rows_effected ?? "",
      query_time: executionMeta?.query_time ?? "",
      query_title: viewName || "",
    };

    try {
      const response = await ApiService.saveChat(payload);
      if (response.data.isSuccess) {
        console.log("Chat saved successfully:", response.data.message);
      } else {
        console.error("Failed to save chat:", response.data.message);
      }
    } catch (error) {
      console.error("Error saving chat:", error);
    } finally {
      setIsConfirmSaveModalOpen(false);
      setViewName(""); // Clear input after saving
    }
  };

  return (
    <div className="w-full min-h-screen px-5 mt-5">
      {isSessionDataMissing && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded-lg shadow-md"
          role="alert"
        >
          <p className="font-bold">Session Data Missing</p>
        </div>
      )}

      {/* Chat Header */}
      <div className="pb-5 bg-[#D9D9D91A] rounded-xl">
        <div className="px-5 pt-4">
          <h1 className="text-lg font-semibold text-gray-800">
            Speak to Data Doctor
          </h1>
          <div className="text-gray-500 text-md flex flex-row items-center gap-20 border-gray-200">
            <div className="border-b-2 border-[#D9D9D9] w-[100%] gap-6 mt-1 flex" />
          </div>
        </div>

        {/* Chat Box */}
        <div className="px-5 py-6 text-gray-700 whitespace-pre-line flex items-start gap-2 ">
          <span>{chat?.question}</span>
        </div>

        {/* Input */}
        <form
          onSubmit={handleSendMessage}
          className="mx-4 border rounded-xl flex justify-between items-center px-5 py-2 mt-20 text-gray-500 bg-white"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isSessionDataMissing
                ? "Cannot send messages due to missing session ID."
                : "Ask a question to generate a script..."
            }
            disabled={isSessionDataMissing || isSending} // Disabled when session is missing or sending
            className={`w-full h-full bg-transparent outline-none text-sm text-gray-800 ${
              isSessionDataMissing || isSending ? "cursor-not-allowed" : ""
            }`}
          />

          <button
            type="submit"
            disabled={isSessionDataMissing || isSending} // Disabled when session is missing or sending
            className={`p-2 rounded-full hover:bg-gray-100 ${
              isSessionDataMissing || isSending
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
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
        <div className="flex flex-row items-center justify-between px-5">
          <h1 className="text-lg font-semibold text-gray-800 mt-1">
            Script view
            <p className="text-sm text-gray-500 mb-4">Run available script</p>
          </h1>

          <div className="flex flex-row items-center justify-between px-5 pr-0">
            {/* Left empty space or other content can stay here */}
            <div className="w-[420px] flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-2 shadow-sm">
              <input
                type="text"
                value={viewName}
                onChange={(e) => setViewName(e.target.value)}
                placeholder={
                  isScriptRunSuccess
                    ? "Name and save your custom view"
                    : "Run a script to enable saving"
                }
                className={`text-gray-600 text-sm bg-transparent outline-none w-full ${
                  !isScriptRunSuccess ? "cursor-not-allowed" : ""
                }`}
                disabled={!isScriptRunSuccess}
              />
              <button
                onClick={() => setIsConfirmSaveModalOpen(true)}
                disabled={!isScriptRunSuccess || !viewName.trim()}
                className={`px-5 py-1 rounded-md bg-gray-200 text-gray-600 text-sm transition ${
                  !isScriptRunSuccess || !viewName.trim()
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-300"
                }`}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="mx-4 p-6 bg-white shadow-sm mb-10 rounded-xl relative">
          <button
            onClick={handleRunScript}
            disabled={isSessionDataMissing || isExecuting} // Disabled when session is missing or executing
            className={`absolute right-6 top-6 px-5 py-1 bg-gray-200 text-gray-700 text-sm rounded transition-colors ${
              isSessionDataMissing || isExecuting
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
          >
            {isExecuting ? "Running..." : "Run"}
          </button>

          <div
            id="script-container"
            className="mt-10 text-sm font-mono relative min-h-[150px] max-h-[350px] overflow-y-auto max-w-[1300px]"
          >
            {/* This SyntaxHighlighter displays the progressively typed and highlighted query. */}
            <SyntaxHighlighter
              language="sql"
              style={oneLight}
              customStyle={{
                backgroundColor: "transparent",
                padding: 0,
                margin: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
              }}
            >
              {typedQuery + (typedQuery === (chat?.query || "") ? "" : " ")}
            </SyntaxHighlighter>
          </div>

          {displayedLogs.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 space-y-2 text-sm -mx-6 px-5">
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
      </div>
      <div className="mb-10 px-5">
        {" "}
        {tableData && tableData.rows.length > 0 && (
          <div className="p-2 bg-white rounded-xl shadow-md">
            {" "}
            <ProductDataTable
              data={tableData.rows}
              columns={tableData.columns}
              globalFilter={""}
            />{" "}
          </div>
        )}{" "}
      </div>
      <ConfirmSaveView />
    </div>
  );
}
