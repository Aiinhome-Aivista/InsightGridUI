import { useState,useRef } from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import '../../../styles/tippy-theme.css';
import { InputText } from "primereact/inputtext";
import ColumnSelectionPage from "../../../Modal/column-section-page";
import ForumIcon from '@mui/icons-material/Forum';
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme";
import { Dropdown } from "primereact/dropdown";

interface HeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onRefresh: () => void;
}

export default function DashboardHeader({
  globalFilter,
  setGlobalFilter,
  onRefresh,
}: HeaderProps) {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState(null);
    const [tableOptions, setTableOptions] = useState([]);
  const dropdownRef = useRef<Dropdown>(null);
  const handleRefresh = () => {
    // Don't do anything if already refreshing
    if (isRefreshing) return;

    setIsRefreshing(true);
    onRefresh();

    // Simulate a refresh delay
    setTimeout(() => setIsRefreshing(false), 1500);
  };
 const [isLoading, setIsLoading] = useState(false); // Dummy isLoading state

  // Dummy functions to satisfy the Dropdown props
  const handleViewChange = (e: { value: any }) => {
    setSelectedView(e.value);
    // console.log("Selected table:", e.value);
  };
  const handleDropdownShow = () => {
    // console.log("Dropdown shown");
  };
  const handleDropdownHide = () => {
    // console.log("Dropdown hidden");
  };
  return (
    <>
      <header
        // style={{ backgroundColor: theme.surface }}
        className="w-full"
      >
        <div className="px-4 sm:px-6 lg:px-8">
          {/* Responsive Flex Container */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between h-auto md:h-20 py-4 md:py-0">

            {/* Left Section */}
            <div className="flex-shrink-0 text-center md:text-left">
              <h1 className="text-xl font-semibold" style={{ color: theme.primaryText }}>
                Tabular view
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: theme.secondaryText }}
              >
                Start by uploading a data file to create your first view.
              </p>
            </div>

            {/* Center Search Bar */}
            <div className="w-full md:flex-1 flex justify-center order-3 md:order-none">
              <div className="relative w-full">
                <SearchRoundedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  sx={{ color: theme.secondaryText }}
                />

                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Global Search"
                  className="pl-10 w-full h-10 rounded-xl border text-sm"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.primaryText,
                    borderColor: theme.border,
                  }}
                />
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
                  <Dropdown
                                ref={dropdownRef}
                                value={selectedView}
                                options={tableOptions}
                                onChange={handleViewChange}
                                loading={isLoading}
                                onShow={handleDropdownShow}
                                onHide={handleDropdownHide}
                                filter
                                placeholder="Select available view data"
                                className="p-4
                    w-80 h-11
                    border border-[#E5E5E5]
                    rounded-xl
                    text-[#6F6F6F]
                    text-sm
                    flex items-center
                    bg-white
                    focus:ring-0 focus:outline-none
                    shadow-none
                  "
                  
                                  
                                panelClassName=" pl-4
                    rounded-xl shadow-md
                    text-[#6F6F6F] bg-white
                  "
                              />
              {/* Chat Icon */}
              <Tippy content="InsightGrid Chat" theme="gray">
                <div
                  onClick={() => navigate("/layout/chatScreen")}
                  className="relative text-center border rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-500/10 transition-colors"
                  style={{ borderColor: theme.border }}
                >
                
                  <ForumIcon
                    className="w-5 h-5"
                    sx={{
                      color: theme.secondaryText,
                      transition: "color 0.2s",
                      "&:hover": { color: theme.primaryText },
                    }}
                  />
                </div>
              </Tippy>
        
              <Tippy content="Select Columns" theme="gray">
                <div
                  onClick={() => setShowColumnModal(true)}
                  className="relative text-center border rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-500/10 transition-colors"
                  style={{ borderColor: theme.border }}
                >
                  
                  <ViewColumnRoundedIcon
                    className="w-5 h-5"
                    sx={{
                      color: theme.secondaryText,
                      transition: "color 0.2s",
                      "&:hover": { color: theme.primaryText },
                    }}
                  />
                </div>
              </Tippy>

              {/* Refresh */}
              <Tippy content="Refresh" theme="gray">
                <div
                  onClick={handleRefresh}
                  className={`relative text-center border rounded-xl w-10 h-10 flex items-center justify-center transition-colors ${
                    isRefreshing ? 'cursor-not-allowed' : 'cursor-pointer hover:bg-gray-500/10'
                  }`}
                  style={{ borderColor: theme.border }}
                >
                  {isRefreshing ? (
                    <AutorenewRoundedIcon className="w-5 h-5 animate-spin" sx={{ color: theme.secondaryText }} />
                  ) : (
                    <AutorenewRoundedIcon
                      className="w-5 h-5"
                      sx={{
                        color: theme.secondaryText,
                        "&:hover": { color: theme.primaryText },
                      }}
                    />
                  )}
                </div>
              </Tippy>
            </div>
          </div>
        </div>
      </header>

    </>
  );
}