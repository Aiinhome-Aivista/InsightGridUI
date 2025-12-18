import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { MdOutlineHourglassEmpty } from "react-icons/md";
import DownloadView from "../../utils/download/downloadView";
import { AuthProvider, useAuth } from "../Auth/AuthContext";
import ApiServices from "../../services/ApiServices";
import { generatePDF } from "../../utils/download/function";
import Tippy from "@tippyjs/react";

const ReportDesignManage = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { downloadData, setDownloadData } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // const queries = [
  //   {
  //     id: 1,
  //     query_title: "Customer Master View",
  //     created_date: "11-12-2025",
  //     created_at: "10:35:22",
  //     rows_effected: 1200,
  //   },
  //   {
  //     id: 2,
  //     query_title: "Sales Region Summary",
  //     created_date: "10-12-2025",
  //     created_at: "16:15:52",
  //     rows_effected: 842,
  //   },
  //   {
  //     id: 3,
  //     query_title: "Employee Active List",
  //     created_date: "09-12-2025",
  //     created_at: "09:12:18",
  //     rows_effected: 450,
  //   },
  // ];


  const getStoredUser = () => {
    try {
      const raw = localStorage.getItem("ig_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  // const getDateTime = (value: string) => {
  //   const d = new Date(value);
  //   return {
  //     date: d.toLocaleDateString(),
  //     time: d.toLocaleTimeString(),
  //   };
  // };

  useEffect(() => {
    fetchReportList();
  }, []);

  const fetchReportList = async () => {
    try {
      setLoading(true);

      const user = getStoredUser();

      if (!user?.session_id || !user?.user_id) {
        console.error("Session or User ID missing");
        return;
      }

      const payload = {
        session_id: user.session_id,
        created_by: user.user_id,
      };

      const response = await ApiServices.getReportList(payload);

      console.log("📥 Full API Response:", response);
      console.log("📥 Response Data:", response?.data);

      setReports(response?.data?.data?.["Report list"] || []);
    } catch (error) {
      console.error("Report list error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };



  // const filteredQueries = queries.filter((q) =>
  //   Object.values(q).some((v) =>
  //     String(v).toLowerCase().includes(globalFilter.toLowerCase())
  //   )
  // );

  const filteredReports = reports.filter((r) =>
    Object.values(r).some((v) =>
      String(v).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

  const handlePreview = async (report: any) => {
    try {
      const aiResponse = report?.query?.ai_responce;
      if (!aiResponse) return;

      const execRes = await ApiServices.executeSql({
        sql_query: aiResponse,
      });

      const api = execRes.data.data;

      // ✅ only last word "report" remove
      const cleanFileName = report.report_name
        .replace(/\s*report$/i, "")
        .trim();

      generatePDF(
        {
          rows: api.rows,
          columns: api.columns.map((c: string) => ({ column_name: c })),
        },
        "preview", // 👈 IMPORTANT
        cleanFileName   // ✅ এখানেই যাবে
      );
    } catch (err) {
      console.error("Preview failed", err);
    }
  };



  // const handleDownload = async (report: any) => {
  //   try {
  //     const aiResponse = report?.query?.ai_responce;

  //     if (!aiResponse) {
  //       console.error("SQL not found in report");
  //       return;
  //     }

  //     const execRes = await ApiServices.executeSql({
  //       sql_query: aiResponse,
  //     });

  //     const api = execRes.data.data;

  //     const pdfData = {
  //       rows: api.rows || [],
  //       columns: (api.columns || []).map((c: string) => ({
  //         column_name: c,
  //       })),
  //     };

  //     // ✅ THIS LINE WAS MISSING
  //     generatePDF(pdfData);

  //   } catch (err) {
  //     console.error("Download failed", err);
  //   }
  // };


  const handleDownload = async (report: any) => {
    try {
      const aiResponse = report?.query?.ai_responce;
      if (!aiResponse) return;

      const execRes = await ApiServices.executeSql({
        sql_query: aiResponse,
      });

      const api = execRes.data.data;

      // ✅ only last word "report" remove
      const cleanFileName = report.report_name
        .replace(/\s*report$/i, "")
        .trim();

      generatePDF(
        {
          rows: api.rows || [],
          columns: (api.columns || []).map((c: string) => ({
            column_name: c,
          })),
        },
        "download",
        cleanFileName   // ✅ এখানেই যাবে
      );

    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setGlobalFilter("");
    await fetchReportList();
  };
  return (
    <div className="mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        {/* Left Side */}
        <div className="flex items-center gap-8">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              Report Designer
            </h1>
            <p className="text-sm text-gray-500 mt-1 whitespace-nowrap">
              Create reports from saved queries and visualise your data.
            </p>
          </div>

          <button
            className="bg-blue-400 hover:bg-blue-700 h-10 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center"
            style={{ width: "108px", }}
            onClick={() => navigate("/layout/report-designer-view")}
          >
            Create Report
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Global Search"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 h-10
                         focus:bg-white focus:ring-1 focus:ring-[#5433FF] outline-none transition-all"
              style={{ width: "568px" }}
            />
          </div>

          {/* Refresh Button */}
          {/* <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 
                             bg-gray-50 hover:bg-gray-100 transition-all"
          >
            <AutorenewRoundedIcon
              className="w-5 h-5 text-gray-500"
              fontSize="small"
            />
          </button> */}
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

      {/* <DownloadView data={downloadData} /> */}
      {/* Table Section */}
      {loading ? (
        <div className="flex justify-center py-24 text-gray-500">
          <AutorenewRoundedIcon className="animate-spin" fontSize="small" />
        </div>
      ) : filteredReports.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-5 py-3 text-left">Report Name</th>
                <th className="px-5 py-3 text-left">Saving Date</th>
                <th className="px-5 py-3 text-left">Saving Time</th>
                <th className="px-5 py-3 text-left">Rows</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((item) => {
                // const { date, time } = getDateTime(item.created_at);

                return (
                  <tr key={item.report_id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-xs">
                      {item.report_name}
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-600">
                      {item.actual_created_date}
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-600">
                      {timeAgo(item.actual_created_date, item.actual_created_at)}
                    </td>

                    <td className="px-6 py-3 text-xs text-gray-600">
                      {item.row_affected}
                    </td>

                    <td className="px-6 py-3">
                      <div className="flex justify-end gap-2">
                        <button className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs" onClick={() => handlePreview(item)}>
                          Preview
                        </button>

                        <button className="text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-xs" onClick={() => handleDownload(item)}>
                          Download
                        </button>

                        {/* <button
                          className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs"
                          onClick={() =>
                            navigate("/layout/report-designer-view", {
                              state: { report_id: item.report_id },
                            })
                          }
                        >
                          Edit
                        </button> */}
                        <button
                          className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs"
                          onClick={() => {
                            console.log(" Edit Report Data:", item);

                            navigate("/layout/report-designer-view", {
                              state: { report: item },
                            });
                          }}
                        >
                          Edit
                        </button>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[300px]">
          <MdOutlineHourglassEmpty size={40} className="text-gray-400" />
          <p className="text-gray-500 mt-2">Empty Report List</p>
        </div>
      )}
    </div>
  );
};

export default ReportDesignManage;
