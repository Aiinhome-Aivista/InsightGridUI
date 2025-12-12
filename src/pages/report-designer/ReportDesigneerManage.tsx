import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import { MdOutlineHourglassEmpty } from "react-icons/md";

const ReportDesignManage = () => {
  const navigate = useNavigate();
  const [globalFilter, setGlobalFilter] = useState("");

  const queries = [
    {
      id: 1,
      query_title: "Customer Master View",
      created_date: "11-12-2025",
      created_at: "10:35:22",
      rows_effected: 1200,
    },
    {
      id: 2,
      query_title: "Sales Region Summary",
      created_date: "10-12-2025",
      created_at: "16:15:52",
      rows_effected: 842,
    },
    {
      id: 3,
      query_title: "Employee Active List",
      created_date: "09-12-2025",
      created_at: "09:12:18",
      rows_effected: 450,
    },
  ];

  const filteredQueries = queries.filter((q) =>
    Object.values(q).some((v) =>
      String(v).toLowerCase().includes(globalFilter.toLowerCase())
    )
  );

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
              Start by uploading a data file to create your first view.
            </p>
          </div>

          <button
            className="bg-blue-400 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all flex items-center justify-center"
            style={{ width: "108px", height: "45px" }}
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
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 
                         focus:bg-white focus:ring-2 focus:ring-[#5433FF] outline-none transition-all"
              style={{ width: "568px", height: "45px" }}
            />
          </div>

          {/* Refresh Button */}
          <button
            className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 
                             bg-gray-50 hover:bg-gray-100 transition-all"
          >
            <AutorenewRoundedIcon
              className="w-5 h-5 text-gray-500"
              fontSize="small"
            />
          </button>
        </div>
      </div>

      {/* Table Section */}
      {filteredQueries.length > 0 ? (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            {/* Table Header */}
            <thead className="bg-gray-100 text-gray-500 text-sm uppercase">
              <tr>
                <th className="px-5 py-3 font-semibold text-left align-middle">
                  Report Name
                </th>
                <th className="px-5 py-3 font-semibold text-left align-middle">
                  Saving Date
                </th>
                <th className="px-5 py-3 font-semibold text-left align-middle">
                  Saving Time
                </th>
                <th className="px-5 py-3 font-semibold text-left align-middle">
                  Rows
                </th>
                <th className="px-5 py-3 font-semibold text-right align-middle">
                  ACTION
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-gray-100">
              {filteredQueries.map((query) => (
                <tr
                  key={query.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-3 text-xs font-normal align-middle">
                    {query.query_title}
                  </td>

                  <td className="px-6 py-3 text-gray-600 text-xs font-normal align-middle">
                    {query.created_date}
                  </td>

                  <td className="px-6 py-3 text-gray-600 text-xs font-normal align-middle">
                    {query.created_at}
                  </td>

                  <td className="px-6 py-3 text-gray-600 text-xs font-normal align-middle">
                    {query.rows_effected}
                  </td>

                  {/* Action Column */}
                  <td className="px-6 py-3 align-middle">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 bg-blue-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200">
                        Preview
                      </button>

                      <button className="text-purple-600 bg-purple-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-purple-200">
                        Download
                      </button>

                      <button className="text-green-600 bg-green-100 px-3 py-1 rounded-full text-xs font-medium hover:bg-green-200">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-[calc(100vh-20rem)]">
          <MdOutlineHourglassEmpty size={50} className="text-gray-400" />
          <p className="text-gray-500 text-lg mt-3">Empty Report List</p>
        </div>
      )}
    </div>
  );
};

export default ReportDesignManage;
