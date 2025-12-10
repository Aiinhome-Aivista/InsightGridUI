import { useEffect, useState } from "react";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ApiServices from "../../services/ApiServices";
import { useAuth } from "../Auth/AuthContext";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useTheme } from "../../theme";

const ShowQuery = () => {
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
      // Convert DD-MM-YYYY → YYYY-MM-DD
      const [d, m, y] = dateStr.split("-");
      const isoDate = `${y}-${m}-${d}`;

      // Convert 12hr → 24hr with JS
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
      // Ensure isRefreshing is set to false after the fetch completes
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
  // handleEditClick and the placeholder fetchSavedQueries function are removed
  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    setGlobalFilter("");
    await fetchSavedQueries();
    // isRefreshing is set to false in fetchSavedQueries' finally block
  };


  // Outside component
  const handleDetailsClick = (rowData) => {
    // console.log("row data workflow", rowData);
    navigate("/layout/query-designer", { state: { ...location.state, data: rowData, type: 'workflow' } });
  };

  const filteredQueries = queries.filter((query) => {
    return Object.values(query).some(value =>
      String(value).toLowerCase().includes(globalFilter.toLowerCase())
    );
  });

  return (
    <div className=" mx-auto px-6 py-8">

      {/* Header */}
{/* Header Container */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        
        {/* Left Side: Title text AND Action Button grouped together */}
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">Query Designer</h1>
            <p className="text-sm text-gray-500 mt-1 whitespace-nowrap">
              Start by uploading a data file to create your first view.
            </p>
          </div>

          <button
            onClick={() => navigate("/layout/query-designer")}
            className="bg-[#2563eb] hover:bg-[#462bd5] text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center"
            style={{ width: '108px', height: '45px' }}
          >
            Create Query
          </button>
        </div>

        {/* Right Side: Search & Refresh */}
        <div className="flex items-center gap-3">
          
          {/* Query Designer */}
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
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:bg-white focus:ring-2 focus:ring-[#5433FF] focus:border-transparent outline-none transition-all"
              style={{ width: '568px', height: '45px' }}
            />
          </div>

          {/* Refresh Icon */}
          <Tippy content="Refresh" theme="gray">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`
                w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 
                bg-gray-50 hover:bg-gray-100 transition-all
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
          <AutorenewRoundedIcon className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : filteredQueries.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-500 text-sm uppercase">
              <tr>
                <th className="text-left px-5 py-1 font-semibold">Query</th>
                <th className="text-left px-5 py-1 font-semibold">Query Saving Date</th>
                <th className="text-left px-5 py-1 font-semibold">Query Saving Time</th>
                <th className="text-left px-5 py-1 font-semibold">Executing Time</th>
                <th className="text-left px-5 py-1 font-semibold">Row Effected</th>
                <th className="text-right px-5 py-1 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredQueries.map((query) => (
                <tr key={query.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-1 text-xs font-normal">{query.query_title}</td>
                  <td className="px-6 py-1 text-gray-600 text-xs font-normal">{query.created_date}</td>
                  <td className="px-6 py-1 text-gray-600 text-xs font-normal">{timeAgo(query.created_date, query.created_at)}</td>
                  <td className="px-6 py-1 text-gray-600 text-xs font-normal">{query.query_time}</td>

                  <td className="px-6 py-1 text-gray-600 text-xs font-normal">{query.rows_effected}</td>
                  <td className="px-6 py-1 text-right">
                    <button className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200"
                      onClick={() => handleDetailsClick(query)} >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-20rem)]">
          <MdOutlineHourglassEmpty size={50} className="text-gray-400" />
          <p className="text-gray-500 text-lg mt-3">Empty Query list</p>
        </div>
      )}

    </div>
  );
};

export default ShowQuery;