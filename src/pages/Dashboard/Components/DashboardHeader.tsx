import { useState } from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import { InputText } from "primereact/inputtext";
import CloseIcon from "@mui/icons-material/Close";
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import ColumnSectionPage from "../../../Modal/column-section-page";

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
      <header className="bg-white">
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
                <SearchRoundedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
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

      {showColumnModal && (
        <ColumnSectionPage onClose={() => setShowColumnModal(false)} />
      )}
    </>
  );
}