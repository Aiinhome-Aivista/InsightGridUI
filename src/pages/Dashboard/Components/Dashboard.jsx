import React, { useEffect, useState, useRef } from "react";
import ApiService from "../../../services/ApiServices";

// Chart imports
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels
);

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
      if (response?.data?.isSuccess) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  }

  const formatApiDateTime = (dateStr) => {
    if (!dateStr) return "";
    const cleanDate = dateStr.replace(" GMT", "");
    const date = new Date(cleanDate + " UTC");
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    });
  };

  const stats = {
    totalUploaded: dashboardData?.total_uploaded_files || 0,
    totalExtracted: dashboardData?.total_extracted_files || 0,
    totalQueries: dashboardData?.total_queries || 0,
    totalReports: dashboardData?.total_reports_generated || 0,
  };

  /* ---------- BAR CHART ---------- */
  const barChartData = dashboardData?.latest_file && {
    labels: ["Total Rows", "Inserted Rows", "Actual Rows"],
    datasets: [
      {
        data: [
          dashboardData.latest_file.total_rows,
          dashboardData.latest_file.last_inserted_rows,
          dashboardData.latest_file.actual_rows,
        ],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b"],
        borderRadius: 8,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, grid: { display: false } },
    },
  };

  /* ---------- PIE CHART ---------- */
  const pieChartData = dashboardData?.latest_file && {
    labels: ["Table Extract", "Column Extract", "Insert"],
    datasets: [
      {
        data: [
          dashboardData.latest_file.table_extraction_status === "done" ? 1 : 0,
          dashboardData.latest_file.column_extraction_status === "done" ? 1 : 0,
          dashboardData.latest_file.data_insert_status === "done" ? 1 : 0,
        ],
        backgroundColor: ["#2563eb", "#16a34a", "#f59e0b"],
        borderWidth: 0,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: { usePointStyle: true, padding: 16 },
      },
      datalabels: {
        color: "#1f2937",
        font: { weight: "600", size: 12 },
        formatter: (_, ctx) => ctx.chart.data.labels[ctx.dataIndex],
        anchor: "end",
        align: "end",
        offset: 10,
      },
    },
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 p-4 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="mb-4 px-4">
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Insights Dashboard
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          File & Report Summary
        </p>
      </div>

      <div className="flex-1 flex flex-col gap-4 px-4 overflow-hidden">
        {/* ---------- STATS + TABLE ---------- */}
        <div className="flex gap-4">
          {/* Stats */}
          <div className="w-[40%] grid grid-cols-2 gap-4">
            {[
              { label: "Total Uploaded Files", value: stats.totalUploaded },
              { label: "Total Extracted Files", value: stats.totalExtracted },
              { label: "Total Queries", value: stats.totalQueries },
              { label: "Reports Generated", value: stats.totalReports },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 text-center shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <p className="text-2xl font-bold text-blue-600">{item.value}</p>
                <p className="text-xs text-slate-600 mt-1">{item.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="w-[60%] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transition-all duration-200 hover:shadow-md">
            {dashboardData?.latest_file ? (
              <div className="overflow-auto max-h-[260px]">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 sticky top-0">
                    <tr>
                      {[
                        "File",
                        "Table",
                        "Rows",
                        "Table",
                        "Column",
                        "Insert",
                        "Size",
                        "Updated",
                      ].map((h, i) => (
                        <th key={i} className="px-3 py-3 text-left font-semibold text-slate-700">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="hover:bg-slate-50 transition">
                      <td className="px-3 py-3 font-medium">
                        {dashboardData.latest_file.file_name}
                      </td>
                      <td className="px-3 py-3">{dashboardData.latest_file.table_name}</td>
                      <td className="px-3 py-3">{dashboardData.latest_file.last_inserted_rows}</td>

                      {[
                        dashboardData.latest_file.table_extraction_status,
                        dashboardData.latest_file.column_extraction_status,
                        dashboardData.latest_file.data_insert_status,
                      ].map((s, i) => (
                        <td key={i} className="px-3 py-3">
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                            {s}
                          </span>
                        </td>
                      ))}

                      <td className="px-3 py-3">{dashboardData.latest_file.file_size_mb}</td>
                      <td className="px-3 py-3 whitespace-nowrap text-slate-500">
                        {formatApiDateTime(dashboardData.latest_file.updated_at)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-slate-500 py-10">No data available</p>
            )}
          </div>
        </div>

        {/* ---------- CHARTS ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              File Data Overview
            </p>
            <div className="h-[260px]">
              {barChartData && <Bar data={barChartData} options={barChartOptions} />}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 transition-all duration-200 hover:shadow-md">
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Processing Completion
            </p>
            <div className="h-[260px]">
              {pieChartData && <Pie data={pieChartData} options={pieChartOptions} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
