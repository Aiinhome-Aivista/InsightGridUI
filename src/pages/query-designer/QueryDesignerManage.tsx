import { useEffect, useState } from "react";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ApiServices from "../../services/ApiServices";
import { useAuth } from "../Auth/AuthContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useTheme } from "../../theme";
import ProductDataTable from "./components/DataTable";
const QueryDesignerManage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const { theme } = useTheme();

  const timeAgo = (dateStr: string, timeStr: string) => {
    if (!dateStr || !timeStr) return "";

    try {
      const [d, m, y] = dateStr.split("-");
      const isoDate = `${y}-${m}-${d}`;
      const cleanTime = new Date(`1970-01-01 ${timeStr}`).toLocaleTimeString("en-GB", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      const fullTimestamp = `${isoDate} ${cleanTime}`;
      const created = new Date(fullTimestamp);
      const now = new Date();
      let diffMs = now.getTime() - created.getTime();
      if (diffMs < 0) return "Just now";
      const seconds = Math.floor(diffMs / 1000);
      const minutes = Math.floor(seconds / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      if (seconds < 5) return "Just now";
      if (seconds < 60) return `${seconds} sec ago`;
      if (minutes < 60) return `${minutes} min ago`;
      if (hours < 24) return `${hours} hr ago`;
      if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
      if (days < 30) return `${Math.floor(days / 7)} week${days >= 14 ? "s" : ""} ago`;
      if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

      return `${years} year${years > 1 ? "s" : ""} ago`;

    } catch (e) {
      console.error("timeAgo parse error:", e);
      return "";
    }
  };

  const fetchSavedQueries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = { session_id: user?.session_id, created_by: user?.user_id };
      const response = await ApiServices.getSavedQueryResponse(payload);
      if (response.data.isSuccess) {
        setQueries(response.data.data.queries || []);
      } else {
        setError(response.data.message || "Failed to load queries.");
      }
    } catch (err) {
      setError("An error occurred while fetching saved queries.");
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.session_id && user?.user_id) {
      fetchSavedQueries();
    } else {
      setIsLoading(false);
      setError("User session not found. Please log in again.");
    }
  }, [user]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setGlobalFilter("");
    await fetchSavedQueries();
  };

  const handleDetailsClick = (rowData) => {
    navigate("/layout/query-designer", { state: { ...location.state, data: rowData, type: 'workflow' } });
  };
  const getLastMessageMeta = (messages = []) => {
    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        query_time: "-",
        rows_effected: "-"
      };
    }

    const lastMessage = messages[messages.length - 1];

    return {
      query_time: lastMessage?.query_time || "-",
      rows_effected: lastMessage?.row_count ?? "-"
    };
  };

  const transformedQueries = queries.map((query) => {
    const { query_time, rows_effected } = getLastMessageMeta(query.messages);

    return {
      ...query,
      time_ago: timeAgo(query.created_date, query.created_at),
      query_time,
      rows_effected,
      action: (
        <div className="text-right">
          <button
            className="text-[#46BA2F] bg-[rgba(53,255,2,0.1)] px-4 py-1 rounded-full text-xs font-medium hover:bg-green-200"
            onClick={() => handleDetailsClick(query)}
          >
            Edit
          </button>
        </div>
      )
    };
  });
  const queryColumns = [
    {
      column_name: 'query_title',
      header: 'Query',
      sortable: false
    },
    {
      column_name: 'created_date',
      header: 'Query Saving Date',
      sortable: false
    },
    {
      column_name: 'time_ago',
      header: 'Query Saving Time',
      sortable: false
    },
    {
      column_name: 'query_time',
      header: 'Query Execution Time',
      sortable: false
    },
    {
      column_name: 'rows_effected',
      header: 'Row Effected',
      sortable: false
    },
    {
      column_name: 'action',
      header: 'Action',
      sortable: false
    }
  ];
  return (
    <div className="mx-auto px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-semibold text-[#1C1B1F] leading-tight">Query Designer</h1>
            <p className="text-[12px] text-[#888585] mt-1 whitespace-nowrap">
              Start by creating your first query using Query Designer.

            </p>
          </div>
          <button
            onClick={() => navigate("/layout/query-designer")}
            className="bg-blue-400 hover:bg-blue-700 h-10 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center"
            style={{
              width: '108px',
            }}
          >
            Create Query
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400 group-focus-within:text-[#5433FF] transition-colors"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Global Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-[#D9D9D9] rounded-lg h-10 text-sm bg-gray-50 focus:bg-white focus:ring-1 focus:ring-[#5433FF] focus:border-transparent outline-none transition-all"
              style={{ width: '568px' }}
            />
          </div>
          <Tippy content="Refresh" theme="gray">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`
                w-10 h-10 flex items-center justify-center rounded-lg border border-[#D9D9D9] 
                bg-[#D9D9D9] hover:bg-[#D9D9D9] transition-all
                ${isRefreshing ? "opacity-70 cursor-wait" : "cursor-pointer"}
              `}
            >
              <AutorenewRoundedIcon
                className={`w-5 h-5 text-gray-500 ${isRefreshing ? "animate-spin" : ""}`}
                fontSize="small"
              />
            </button>
          </Tippy>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center py-10">
          <AutorenewRoundedIcon className="w-5 h-5 animate-spin text-gray-500"   fontSize="small"/>
          
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : queries.length > 0 ? (
        <ProductDataTable
          data={transformedQueries}
          globalFilter={globalFilter}
          columns={queryColumns}
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-20rem)]">
          <MdOutlineHourglassEmpty size={40} className="text-gray-400" />
          <p className="text-gray-500 text-lg mt-3">Empty Query list</p>
        </div>
      )}
    </div>
  );
};

export default QueryDesignerManage;