import React, { useEffect, useState, useRef } from "react";
import ApiService from "../../services/ApiServices";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const isInitialMount = useRef(true);
  const userData = JSON.parse(localStorage.getItem("ig_user"));
  const userId = userData?.user_id || "";

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchDashboardData();
    }
  }, []);

  async function fetchDashboardData() {
    try {
      const response = await ApiService.getDashboardData({ user_id: userId });
      
      if (response.data.isSuccess) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }

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
      {/* Header */}
      <div className="mb-3 flex-shrink-0 pl-4">
        <h1 className="text-xl font-semibold text-gray-800">Insight</h1>
        <p className="text-xs text-gray-500">Untitled File Details</p>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden min-h-0 p-4">
        {/* First Row: 4 small cards (40%) + 1 large card (60%) */}
        <div className="flex gap-4 h-[30%]">
          {/* Left side - 4 cards in 2x2 grid (40% width) */}
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

          {/* Right side */}
          <div className="w-[60%] bg-[#D9D9D9] rounded-lg p-3 overflow-auto">
            {dashboardData?.latest_file ? (
              <table className="w-full text-sm border-collapse border border-gray-400">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Session Name</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">File Name</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Table Extract Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Column Extract Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Data Insights Status</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">File Size</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700 border border-gray-400">Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.session_name}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.file_name}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.file_size}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.table_extract_status}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.column_extract_status}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.data_insights_status}</td>
                    <td className="py-2 px-2 text-gray-800 border border-gray-400">{dashboardData.latest_file.updated_at}</td>
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

        {/* Second Row: 3 cards with different widths */}
        <div className="flex gap-4 h-[30%]">
          <div className="w-[20%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 5 - 20% width */}
          </div>
          <div className="w-[50%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 6 - 50% width */}
          </div>
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 7 - 30% width */}
          </div>
        </div>

        {/* Third Row: 2 larger cards + 1 thin column with 4 small cards */}
        <div className="flex gap-4 h-[30%]">
          {/* First card */}
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 8 content */}
          </div>

          {/* Second card */}
          <div className="w-[20%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 9 content */}
          </div>

          {/* Right column with 4 stacked cards */}
          <div className="w-[50%] flex flex-col gap-4">
            <div className="h-[30%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 1 */}
            </div>
            <div className="h-[30%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 2 */}
            </div>
            <div className="h-[30%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 3 */}
            </div>
            <div className="h-[30%] bg-[#D9D9D9] rounded-lg p-2">
              {/* Small card 4 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}