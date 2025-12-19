import React, { useEffect, useState, useRef } from "react";
import ApiService from "../../../services/ApiServices";
export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const isInitialMount = useRef(true);
  const userData = JSON.parse(localStorage.getItem("ig_user"));
  const createdBy = userData?.user_id || "";
  const sessionId = userData?.session_id || "";

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchDashboardData();
    }
  }, [createdBy, sessionId]);

  async function fetchDashboardData() {
    try {
      const payload = { created_by: createdBy, session_id: sessionId };
      const response = await ApiService.getDashboardData(payload);
      
      if (response.data.isSuccess) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }
const formatApiDateTime = (dateStr) => {
  if (!dateStr) return "";

  // Remove GMT so browser won't convert timezone
  const cleanDate = dateStr.replace(" GMT", "");

  const date = new Date(cleanDate + " UTC");

  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC", // 👈 force same time as API
  });
};



  const stats = dashboardData
    ? {
        totalUploaded: dashboardData.total_uploaded_files || 0,
        totalExtracted: dashboardData.total_extracted_files || 0,
        totalQueries: dashboardData.total_queries || 0,
        totalReports: dashboardData.total_reports_generated || 0,
      }
    : { totalUploaded: 0, totalExtracted: 0, totalQueries: 0, totalReports: 0 };

  return (
    <div className="h-[100%] bg-gray-50 p-4 flex flex-col overflow-hidden">
      <div className="mb-3 flex-shrink-0 pl-4">
        <h1 className="text-xl font-semibold text-gray-800">Insights Dashboard</h1>
        <p className="text-xs text-gray-500">{dashboardData?.latest_file?.session_name || 'File & Report Summary'}</p>
      </div>
      <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0 p-4">
        <div className="flex gap-4 flex-1">
          <div className="w-[40%] grid grid-cols-2 gap-4">
            <div className="bg-[#D9D9D9] rounded-lg p-3 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-800">{stats.totalUploaded}</p>
              <p className="text-xs text-gray-600 mt-1">Total Uploaded Files</p>
            </div>
            <div className="bg-[#D9D9D9] rounded-lg p-3 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-800">{stats.totalExtracted}</p>
              <p className="text-xs text-gray-600 mt-1">Total Extracted Files</p>
            </div>
            <div className="bg-[#D9D9D9] rounded-lg p-3 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-800">{stats.totalQueries}</p>
              <p className="text-xs text-gray-600 mt-1">Total Queries</p>
            </div>
            <div className="bg-[#D9D9D9] rounded-lg p-3 flex flex-col items-center justify-center">
              <p className="text-2xl font-bold text-gray-800">{stats.totalReports}</p>
              <p className="text-xs text-gray-600 mt-1">Total Reports Generated</p>
            </div>
          </div>

          <div className="w-[60%] bg-[#D9D9D9] rounded-lg p-3 overflow-auto">
            {dashboardData?.latest_file ? (
              <table className="w-full text-sm border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">File Name</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Table Name</th>
                     <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Rows Affected</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Table Extract Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Column Extract Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Data Insert  Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">File Size</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.file_name}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.table_name}</td>
                      <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.last_inserted_rows}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.table_extraction_status}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.column_extraction_status}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.data_insert_status}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.file_size_mb}</td>
   <td className="py-2 px-2 text-gray-800 border border-gray-400">
  {formatApiDateTime(dashboardData.latest_file.updated_at)}
</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 text-sm">No file data available</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-4 flex-1">
          <div className="w-[20%] bg-[#D9D9D9] rounded-lg p-3">
          </div>
          <div className="w-[50%] bg-[#D9D9D9] rounded-lg p-3">
          </div>
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
          </div>
        </div>
        <div className="flex gap-4 flex-1">
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
          </div>
          <div className="w-[20%] bg-[#D9D9D9] rounded-lg p-3">
          </div>
          <div className="w-[50%] flex flex-col gap-4">
            <div className="flex-1 bg-[#D9D9D9] rounded-lg p-2">
            </div>
            <div className="flex-1 bg-[#D9D9D9] rounded-lg p-2">
            </div>
            <div className="flex-1 bg-[#D9D9D9] rounded-lg p-2">
            </div>
            <div className="flex-1 bg-[#D9D9D9] rounded-lg p-2">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}