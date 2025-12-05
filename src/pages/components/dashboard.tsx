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
        {/* First Row: */}
        <div className="flex gap-4 h-[30%]">
          {/* Left side*/}
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
          <div className="w-[60%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Large card content */}
          </div>
        </div>

        {/* Second Row */}
        <div className="flex gap-4 h-[30%]">
          <div className="w-[20%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 5 - 20% width */}
          </div>
          <div className="w-[50%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 6  */}
          </div>
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 7  */}
          </div>
        </div>

        {/* Third Row */}
        <div className="flex gap-4 h-[30%]">
          {/* First card */}
          <div className="w-[30%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 8 content */}
          </div>

          {/* Second card */}
          <div className="w-[20%] bg-[#D9D9D9] rounded-lg p-3">
            {/* Card 9 content */}
          </div>

          {/* Right column */}
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