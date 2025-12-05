import { useState, useEffect, useRef } from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../../../styles/tippy-theme.css";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import ColumnSelectionPage from "../../../Modal/column-section-page";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme";
import ApiServices from "../../../services/ApiServices";
import AnimatedToggleButton from "../../../Modal/components/animated-toggle-button";

interface HeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  onRefresh: () => void;
  onTableSelect?: (data: any) => void;
  viewSelection: string;
  onViewChange: (view: string) => void;
}

export default function DashboardHeader({
  globalFilter,
  setGlobalFilter,
  onRefresh,
  onTableSelect,
  viewSelection,
  onViewChange,
}: HeaderProps) {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();
  const [selectedView, setSelectedView] = useState(null);
  const [tableOptions, setTableOptions] = useState([]);
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<Dropdown>(null);
  const navigate = useNavigate();
  const toggleOptions = [
    { label: "Meta Data", value: 'metadata' },
    { label: "Data View", value: 'dataview' },
    { label: "Insights", value: 'insights' },
  ];
  const defaultSelectionIndex = toggleOptions.findIndex(opt => opt.value === viewSelection);

  useEffect(() => {
    const sessionData = location.state;

    if (sessionData?.sessionId && sessionData?.sessionName && sessionData?.fileName) {
      const payload = {
        session_id: sessionData.sessionId,
        session_name: sessionData.sessionName,
        file_name: sessionData.fileName,
      };

      ApiServices.getUiData(payload)
        .then((response) => {
          if (response.data.isSuccess) {
            // The initial response might contain the list of tables
            if (response.data.data.tables) {
              const tables = response.data.data.tables.map((table: string) => ({
                label: table,
                value: table, // Use the actual table name as the value
              }));
              setTableOptions(tables);
              if (tables.length > 0 && onTableSelect) {
                const firstTable = tables[0].value;
                setSelectedView(firstTable);
                setIsLoading(true);

                const tablePayload = { ...payload, table_name: firstTable };
                ApiServices.getUiData(tablePayload)
                  .then(tableResponse => {
                    if (tableResponse.data.isSuccess) {
                      onTableSelect(tableResponse.data.data);
                    }
                  })
                  .catch(err => console.error("Error fetching data for the first table:", err))
                  .finally(() => setIsLoading(false));
              }
            }
            // If a table is already selected (e.g. on page load with state), pass its data up
            else if (onTableSelect && response.data.data.rows) {
              onTableSelect(response.data.data);
            }
          }
        })
        .catch((error) => console.error("Error fetching UI data:", error));
    }
  }, []);

  const handleViewChange = (e: { value: any }) => {
    const selectedTable = e.value;
    setSelectedView(selectedTable);

    const sessionData = location.state;
    if (sessionData?.sessionId && sessionData?.sessionName && sessionData?.fileName && selectedTable) {
      const payload = {
        session_id: sessionData.sessionId,
        session_name: sessionData.sessionName,
        file_name: sessionData.fileName,
        table_name: selectedTable,
      };

      setIsLoading(true);
      ApiServices.getUiData(payload)
        .then(response => {
          if (onTableSelect) {
            onTableSelect(response.data.data);
          }
        })
        .catch(error => console.error("Error fetching table data:", error))
        .finally(() => setIsLoading(false));
    }
  };
  const handleRefresh = () => {
    // Don't do anything if already refreshing
    if (isRefreshing) return;

    setIsRefreshing(true);
    onRefresh();

    // Simulate a refresh delay
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  const handleDropdownShow = () => {
    window.addEventListener("scroll", handleScroll, true);
  };

  const handleDropdownHide = () => {
    window.removeEventListener("scroll", handleScroll, true);
  };

  const handleScroll = () => {
    dropdownRef.current?.hide();
  };
  return (
    <>
      <header
        // style={{ backgroundColor: theme.surface }}
        className="w-full"
      >
        <div className="px-3 sm:px-4 lg:px-3 ">
          {/* Responsive Flex Container */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between h-auto md:h-20 py-2 md:py-0">
            {/* Left Section */}
            {/* <div className="flex-shrink-0 text-center md:text-left">
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
            </div> */}

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
                  className="pl-10 w-full h-11 rounded-xl border text-sm"
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
              {/* View Dropdown */}
              <Dropdown
                ref={dropdownRef}
                value={selectedView}
                options={tableOptions}
                onChange={handleViewChange}
                loading={isLoading}
                onShow={handleDropdownShow}
                onHide={handleDropdownHide}
                filter
                placeholder="Select table"
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

              <AnimatedToggleButton
                options={toggleOptions}
                defaultSelected={defaultSelectionIndex}
                onChange={(_index, value) => {
                  onViewChange(value as string);
                }}
                mode="text"
              />

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
                    isRefreshing
                      ? "cursor-not-allowed"
                      : "cursor-pointer hover:bg-gray-500/10"
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

      {showColumnModal && <ColumnSelectionPage onClose={() => setShowColumnModal(false)} />}
    </>
  );
}
