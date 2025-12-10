import { useEffect, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ApiServices from "../../services/ApiServices";
import { useAuth } from "../Auth/AuthContext";

const ShowQuery = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [queries, setQueries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");

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
      <div className="flex items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Query Designer</h1>
          <p className="text-sm text-gray-500">
            Start by uploading a data file to create your first view.
          </p>
        </div>

        <button
          onClick={() => navigate("/layout/query-designer")}
          className="btn-primary shadow mx-6"
        >
          Create Query
        </button>

        <div className="ml-auto flex items-center gap-4">
          {/* Search */}
          <div className="flex justify-end">
            <div className="relative w-[25rem]">
              <input
                type="text"
                placeholder="Global Search"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--theme-accent)]"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m2.6-5.15a7.75 7.75 0 11-15.5 0 7.75 7.75 0 0115.5 0z" />
              </svg>
            </div>
          </div>

          {/* Refresh icon */}
          <div
            style={{ backgroundColor: '#D9D9D9' }}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${isRefreshing ? 'opacity-70' : 'hover:bg-gray-300'}`}
            onClick={async () => {
              if (!isRefreshing) { 
                setIsRefreshing(true);
                setGlobalFilter("");
                await fetchSavedQueries();
              }
            }}
          >
            <LuRefreshCw className={isRefreshing ? 'animate-spin' : ''} />
          </div>
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
            <thead className="bg-gray-100 text-gray-500 text-xs">
              <tr>
                <th className="text-left px-6 py-3 font-medium">Query</th>
                <th className="text-left px-6 py-3 font-medium">Query Saving Date</th>
                <th className="text-left px-6 py-3 font-medium">Query Saving Time</th>
                <th className="text-left px-6 py-3 font-medium">Executing Time</th>
                <th className="text-left px-6 py-3 font-medium">Row Effected</th>
                <th className="text-left px-6 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredQueries.map((query) => (
                <tr key={query.id}>
                  <td className="px-6 py-4 font-medium">{query.query_title}</td>
                  <td className="px-6 py-4 text-gray-600">{query.created_date}</td>
                  <td className="px-6 py-4 text-gray-600">{timeAgo(query.created_date, query.created_at)}</td>
                  <td className="px-6 py-4 text-gray-600">{query.query_time}</td>

                  <td className="px-6 py-4 text-gray-600">{query.rows_effected}</td>
                  <td className="px-6 py-4">
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