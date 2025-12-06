import { useState, useRef } from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../../../styles/tippy-theme.css";
import { InputText } from "primereact/inputtext";
import ForumIcon from "@mui/icons-material/Forum";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme";
import { MultiSelect } from "primereact/multiselect";

interface HeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onRefresh: () => void;
  selectedTables: string[];
  setSelectedTables: (value: string[]) => void;
  tableOptions: { label: string; value: string }[];
}

export default function DashboardHeader({
  globalFilter,
  setGlobalFilter,
  onRefresh,
  selectedTables,
  setSelectedTables,
  tableOptions,
}: HeaderProps) {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();
  const navigate = useNavigate();
  const multiSelectRef = useRef(null);

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleDropdownShow = () => {
    window.addEventListener("scroll", handleScroll, true);
  };

  const handleDropdownHide = () => {
    window.removeEventListener("scroll", handleScroll, true);
  };

  const handleScroll = () => {
    multiSelectRef.current?.hide();
  };


  // --- CUSTOM TEMPLATE FOR SELECTED ITEMS (CHIPS) ---
  const selectedItemTemplate = (value: string) => {
    // Find the label corresponding to the selected value
    const option = tableOptions.find((opt) => opt.value === value);
    const label = option ? option.label : value;

    if (!label) return null;

    return (
      // Added 'group' class here to control hover state of children
      <div className="group inline-flex items-center bg-[#F3F4F6] text-[#4B5563] rounded-md px-2 py-0.5 text-xs font-medium border border-gray-200 mr-1 mb-1 transition-all">
        <span>{label}</span>
        
        {/* Custom Close Icon */}
        <div
          role="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation(); // Stop dropdown from opening
            const newValue = selectedTables.filter((val) => val !== value);
            setSelectedTables(newValue);
          }}
          // Added: 'opacity-0' (hidden) and 'group-hover:opacity-100' (show on hover)
          className="ml-1.5 cursor-pointer flex items-center justify-center w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200 text-gray-400 hover:text-red-500"
        >
          <CloseRoundedIcon style={{ fontSize: "12px", fontWeight: "bold" }} />
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="w-full">
        <div className="px-4 sm:px-4 lg:px-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between h-auto md:h-20 py-4 md:py-0">
            {/* Left Section */}
            <div className="flex-shrink-0 text-center md:text-left">
              <h1
                className="text-xl font-semibold"
                style={{ color: theme.primaryText }}
              >
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
                  className="pl-10 w-full h-10 rounded-xl border text-sm focus:ring-1 focus:ring-gray-300"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.primaryText,
                    borderColor: theme.border,
                  }}
                />
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-start md:items-center justify-center gap-3 md:gap-4">
              
              {/* --- MULTISELECT --- */}
              <div className="w-full md:w-auto">
                <MultiSelect
                  ref={multiSelectRef}
                  value={selectedTables}
                  options={tableOptions}
                  onChange={(e) => setSelectedTables(e.value)}
                  optionLabel="label"
                  optionValue="value"
                  placeholder="Select Views"
                  display="chip"
                  selectedItemTemplate={selectedItemTemplate}
                  onShow={handleDropdownShow}
                  onHide={handleDropdownHide}
                  
                  // STYLE FIXES:
                  // flex-wrap: Ensures chips flow to next line
                  // content-center: Vertically aligns items
                  className="w-full md:w-80 min-h-[42px] h-auto border border-[#E5E5E5] rounded-xl text-gray-600 text-sm flex flex-wrap content-center items-center bg-white shadow-sm hover:border-gray-300 focus:outline-none focus:ring-0"
                  
                  // Adjusted padding to look balanced
                  style={{ padding: '4px 8px' }}
                  
                  panelClassName="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden mt-1"
                  
                  pt={{
                      wrapper: { className: "max-h-64 overflow-auto custom-scrollbar" },
                      header: { className: "p-3 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-700" },
                      item: { className: "p-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors cursor-pointer" },
                      // Ensure label container allows wrapping inside the input
                      labelContainer: { className: "flex flex-wrap gap-1 rounded-5xl  items-center flex-1" },
                      trigger: { className: "w-8 text-gray-400 flex rounded-5xl items-center justify-center" }
                  }}
                />
              </div>

              {/* Chat Button */}
              <Tippy content="InsightGrid Chat" theme="gray">
                <div
                  onClick={() => navigate("/layout/chatScreen")}
                  className="relative text-center border rounded-xl w-[42px] h-[42px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
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

              {/* Columns Button */}
              <Tippy content="Select Columns" theme="gray">
                <div
                  onClick={() => setShowColumnModal(true)}
                  className="relative text-center border rounded-xl w-[42px] h-[42px] flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
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

              {/* Refresh Button */}
              <Tippy content="Refresh" theme="gray">
                <div
                  onClick={handleRefresh}
                  className={`relative text-center border rounded-xl w-[42px] h-[42px] flex items-center justify-center transition-colors ${
                    isRefreshing
                      ? "cursor-not-allowed bg-gray-50"
                      : "cursor-pointer hover:bg-gray-50"
                  }`}
                  style={{ borderColor: theme.border }}
                >
                  {isRefreshing ? (
                    <AutorenewRoundedIcon
                      className="w-5 h-5 animate-spin"
                      sx={{ color: theme.secondaryText }}
                    />
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