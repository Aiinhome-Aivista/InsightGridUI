import { useState, useEffect, useRef } from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../../../styles/tippy-theme.css";
import { Dropdown } from "primereact/dropdown";
import {useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme";
import ApiServices from "../../../services/ApiServices";
import AnimatedToggleButton from "./AnimatedToggleButton";

interface HeaderProps {
  onRefresh: () => void;
  onTableSelect?: (data: any) => void;
  tableOptions: any[];
  viewSelection: string;
  isLoading: boolean;
  onViewChange: (view: string) => void;

  passedData?: {
    user_query: string;
    query_title: string;
  };
}

export default function DashboardHeader({
  onRefresh,
  onTableSelect,
  tableOptions,
  viewSelection,
  isLoading,
  onViewChange,
  passedData,
}: HeaderProps) {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { theme } = useTheme();
  const [selectedView, setSelectedView] = useState(null);
  const [isChanging, setIsChanging] = useState(false);
  const dropdownRef = useRef<Dropdown>(null);
  const navigate = useNavigate();
  const toggleOptions = [
    { label: "Meta Data", value: "metadata" },
    { label: "Data View", value: "dataview" },
    { label: "Insights", value: "insights" },
  ];
  const defaultSelectionIndex = toggleOptions.findIndex(
    (opt) => opt.value === viewSelection
  );

  useEffect(() => {
    if (tableOptions.length > 0 && !selectedView) {
      setSelectedView(tableOptions[0].value);
    }
  }, [tableOptions, selectedView]);

  const handleViewChange = (e: { value: any }) => {
    const selectedTable = e.value;
    setSelectedView(selectedTable);

    const getStoredUser = () => {
      try {
        const raw = localStorage.getItem("ig_user");
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    };
    const user = getStoredUser();

    if (user && selectedTable) {
      const payload = {
        session_id: user.session_id,
        created_by: user.user_id,
        table_name: selectedTable,
      };

      setIsChanging(true);
      ApiServices.getTableData(payload)
        .then((response) => {
          onTableSelect?.(response.data.data.details[selectedTable]);
        })
        .catch((error) => console.error("Error fetching table data:", error))
        .finally(() => setIsChanging(false));
    }
  };
  const handleRefresh = () => {
    // Don't do anything if already refreshing
    if (isRefreshing) return;

    setIsRefreshing(true);
    onRefresh();

    // Simulate a refresh delay
    setTimeout(() => setIsRefreshing(false), 1000);
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
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors text-gray-700"
              >
                <ArrowBackRoundedIcon fontSize="small" />
              </button>

              <div className="flex flex-col gap-1">
                <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight">
                  Query Designer
                </h1>

                {passedData?.query_title && (
                  <span className="text-sm text-gray-500 -mt-1">
                    {passedData.query_title}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-center gap-3 md:gap-4">
              <Dropdown
                ref={dropdownRef}
                value={selectedView}
                options={tableOptions}
                onChange={handleViewChange}
                loading={isLoading || isChanging}
                loadingIcon={<AutorenewRoundedIcon className="w-5 h-5 animate-spin" />}
                placeholder="Product Details"
                onShow={handleDropdownShow}
                onHide={handleDropdownHide}

                // Base Container Styling
                className="
                w-72 h-11
                bg-gray-50 hover:bg-gray-100
                border border-gray-200 
                rounded-lg 
                flex items-center justify-between
                transition-all duration-200
              "
              
              // Panel (List) Styling
              panelClassName="
                bg-white rounded-xl border border-gray-100 overflow-hidden text-sm
              "
              
              // PassThrough (PT) props for deep styling
              pt={{
                root: { className: 'cursor-pointer' },
                input: { className: 'text-sm font-medium text-gray-700 px-3 py-0' },
                trigger: { className: 'w-8 flex items-center justify-center text-gray-400' },
                list: { className: 'p-1' },
                item: { className: 'px-3 py-2 rounded-md hover:bg-gray-50 text-gray-700 cursor-pointer transition-colors mb-0.5' },
                itemLabel: { className: 'font-medium' }
              }}
            />
              <AnimatedToggleButton
                options={toggleOptions}
                defaultSelected={defaultSelectionIndex}
                onChange={(_index, value) => {
                  onViewChange(value as string);
                }}
                mode="text"
              />

              <Tippy content="Refresh" theme="gray">
                <div
                  onClick={handleRefresh}
                  className={`relative text-center border rounded-xl w-10 h-10 flex items-center justify-center transition-colors ${isRefreshing
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
    </>
  );
}
