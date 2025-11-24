import { useState } from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import { InputText } from "primereact/inputtext";
import CloseIcon from "@mui/icons-material/Close";

interface HeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export default function DashboardHeader({
  globalFilter,
  setGlobalFilter,
}: HeaderProps) {
  const [showColumnModal, setShowColumnModal] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Left: Title + Subtitle */}
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-gray-900">
                Tabular view
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Start by uploading a data file to create your first view.
              </p>
            </div>

            {/* Center: Search */}
            <div className="flex-1 flex justify-center px-4">
              <div className="relative w-full max-w-2xl">
                <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Global Search"
                  className="pl-10 w-full h-10 rounded-xl border border-gray-300 text-sm"
                />
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div
              onClick={() => setShowColumnModal(true)}
              className={`relative text-center border border-[#BCC7D2] rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors`}
            >
              <ViewColumnRoundedIcon
                className={`w-5 h-5`}
                sx={{
                  transition: "color 0.2s ease-in-out",
                  "&:hover": {
                    color: "#2C2E42",
                  },
                }}
              />
            </div>

            <div
              className={`relative text-center border border-[#BCC7D2] rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors`}
            >
              <AutorenewRoundedIcon
                className={`w-5 h-5`}
                sx={{
                  transition: "color 0.2s ease-in-out",
                  "&:hover": {
                    color: "#2C2E42",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Column Settings Modal */}
      {showColumnModal && (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 z-50 flex items-center justify-center">
    <div className="bg-white w-[85%] h-[75%] rounded-2xl shadow-lg overflow-hidden flex flex-col">

      {/* Top Header Section */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
        <button
          onClick={() => setShowColumnModal(false)}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200"
        >
          <i className="pi pi-arrow-left text-gray-700"></i>
        </button>

        <h1 className="text-sm font-medium text-gray-800">Column Selection</h1>

        {/* Name the Collection */}
        <input
          type="text"
          placeholder="Name the Collection"
          className="ml-6 flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
        />

        {/* Search Column */}
        <div className="relative w-80">
          <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Search Column"
            className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
          />
        </div>

        {/* Multi Select */}
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-100">
          Multi Select
        </button>

        {/* Drag & Drop */}
        <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-100">
          Drag & Drop
        </button>
      </div>

      {/* Content Body */}
      <div className="flex flex-1 px-10 py-8 overflow-hidden">

        {/* Left Column List */}
        <div className="w-[260px] pr-10 border-r border-gray-200">

          {/* Default Column */}
          <h3 className="text-xs font-medium text-gray-500 mb-2">
            Default Column (3)
          </h3>

          <div className="space-y-2 text-sm mb-6">
            <p className="text-gray-700">Sales</p>
            <p className="text-gray-700">Product</p>
            <p className="text-gray-700">Customer</p>
          </div>

          {/* Add Column */}
          <h3 className="text-xs font-medium text-gray-500 mb-2">
            Add Column (4)
          </h3>

          <div className="space-y-3 text-sm">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
              Category
            </label>

            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
              Region
            </label>

            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-3" />
              Product Value
            </label>

            <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 mr-3" />
              Purchase Amount
            </label>

            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
              Credit Point
            </label>
          </div>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 pl-10 flex flex-col justify-between">

          {/* Large Empty Workspace (as screenshot) */}
          <div className="flex-1"></div>

          {/* Bottom Info Text */}
          <p className="text-xs text-gray-500 leading-relaxed mt-6">
            Add a new column by defining its name and type. It will appear instantly in your table.
            Use this section to create custom columns that help structure your data better.
            Enter the details of the column you want to add, and it will be added to your dataset.
          </p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={() => setShowColumnModal(false)}
          className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
        >
          Reset
        </button>

        <button
          className="px-6 py-2 bg-gray-300 text-white rounded-lg text-sm cursor-not-allowed"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}

    </>
  );
}