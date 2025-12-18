import { useState, useRef, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../../../styles/tippy-theme.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme";
import { useAuth } from "../../Auth/AuthContext";
import ConfirmSaveView from "../../../Modal/ConfirmSaveView";

export default function DataViewHeader({
  globalFilter,
  setGlobalFilter,
  selectedTables,
  setSelectedTables,
  tableOptions,
  onRefresh,
  onRunScript,
  isRefreshing,
  reportName,
  setReportName,
  onSaveReport,
  editReport,
  setIsRefreshing,

}) {
  const navigate = useNavigate();
  const { setIsConfirmSaveModalOpen, setViewName, setConfirmSaveAction } =
    useAuth();
  const dropdownRef = useRef<Dropdown>(null);
  const { theme } = useTheme();

  const itemTemplate = (option) => {
    if (!option) return null;

    return (
      <Tippy content={option.label} theme="gray" placement="top-start">
        <div>
          {option.label}
        </div>
      </Tippy>
    );
  };

  useEffect(() => {
    if (editReport) {
      console.log(" Edit report in header:", editReport);
    }
  }, [editReport]);

const isEditMode = !!editReport;

  useEffect(() => {
    if (!isEditMode || tableOptions.length === 0) return;

    const queryName = editReport?.query?.query_name;
    if (!queryName) return;

    const matchedOption = tableOptions.find(
      (opt) => opt.label === queryName
    );

    if (matchedOption) {
      //  VERY IMPORTANT
      setSelectedTables([matchedOption.value]);

      // auto load table
      onRunScript?.(matchedOption.value);
    }
  }, [isEditMode, editReport, tableOptions]);

  // useEffect(() => {
  //   if (editReport && tableOptions.length > 0) {
  //     // Try matching by ID first (query_history_id)
  //     let matchedOption = tableOptions.find(
  //       (opt) => opt.value.id === editReport.query_history_id
  //     );

  //     // Fallback: Try matching by name
  //     if (!matchedOption) {
  //       const queryName = editReport.query_name || editReport.query?.query_name || editReport.query_title;
  //       matchedOption = tableOptions.find((opt) => opt.label === queryName);
  //     }

  //     if (matchedOption) {
  //       setSelectedTables([matchedOption]);
  //     }
  //   }
  // }, [editReport, tableOptions]);



  const handleDropdownShow = () => {
    window.addEventListener("scroll", handleScroll, true);
  };

  const handleDropdownHide = () => {
    window.removeEventListener("scroll", handleScroll, true);
  };

  const handleScroll = () => {
    dropdownRef.current?.hide();
  };

  const handleSaveClick = () => {
    setViewName(reportName);
    setConfirmSaveAction(() => async () => {
      await onSaveReport();
      navigate("/layout/report-designer");
    });
    setIsConfirmSaveModalOpen(true);
  };

  return (
    <header className="px-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between h-auto md:h-20">
        <div>
          {/* Responsive Flex Container */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between h-auto md:h-20">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <button
                onClick={() => navigate(-1)}
                className=" hover:bg-gray-100 rounded-full transition-colors text-gray-700"
              >
                <ArrowBackRoundedIcon fontSize="small" />
              </button>

              <div className="flex flex-col ">
                <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-tight whitespace-nowrap">
                  Report Designer
                </h1>

              </div>
            </div>
          </div>
        </div>
        {/* SEARCH */}
        <div className="relative w-full md:w-80 my-3 md:my-0 text-gray-500">
          <SearchRoundedIcon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-full h-10 rounded-xl border focus:outline-none focus:ring-1 focus:ring-[#5433FF]"
            placeholder="Global Search"
          />
        </div>
        <div>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Write a report name(required)"
            className=" px-4 w-full md:w-80  h-10 border border-[#E5E5E5] rounded-xl text-gray-600 text-sm flex flex-wrap content-center items-center bg-white shadow-sm hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#5433FF] gap-1 pr-10"
          />
        </div>
        <div className="flex items-start md:items-center justify-center gap-2">
<Dropdown
  // --- FUNCTIONAL PROPS ---
  ref={dropdownRef}
  value={
    Array.isArray(selectedTables) && selectedTables.length > 0
      ? selectedTables[0]
      : null
  }
  options={tableOptions}
  onChange={(e) => {
    const val = e.value;
    // Prevent re-running if the same item is selected
    if (val !== (selectedTables[0] || null)) {
      setIsRefreshing(true); // Show loader immediately
      setSelectedTables(val ? [val] : []); // This will trigger the data fetch in the parent component
    }
  }}
  optionLabel="label"
  optionValue="value"
  placeholder="Select Views"
  itemTemplate={itemTemplate}
  onShow={handleDropdownShow}
  onHide={handleDropdownHide}

  // --- DESIGN & STYLING ---
  className="
    w-96 h-10
    border border-gray-200 
  rounded-xl
    flex items-center justify-between
    transition-all duration-200
    bg-white
    focus:ring-2 focus:ring-[#5433FF]
  "
  
  // Panel (List) Styling - Added max-w to ensure it doesn't grow too wide
  panelClassName="
    bg-white rounded-xl border border-gray-100 overflow-hidden text-sm max-w-96
  "
  
  // --- DEEP STYLING FIXES ---
  pt={{
    root: { className: 'cursor-pointer' },
    input: { 
      className: 'text-sm font-medium text-gray-700 px-3 py-2 whitespace-normal break-words h-full flex items-center leading-tight' 
    },
    trigger: { className: 'w-8 flex items-center justify-center text-gray-400 shrink-0' },
    list: { className: 'p-1' },
    
    // *** FIX IS HERE: Added 'whitespace-normal' and 'break-words' to item ***
    item: ({ context }: any) => ({
      className: `px-3 py-2 rounded-md text-gray-700 cursor-pointer transition-colors mb-0.5 whitespace-normal break-words ${
        context.selected
          ? 'bg-gray-100 font-semibold'
          : 'hover:bg-gray-50'
      }`
    }),
    itemLabel: { className: 'font-medium' }
  }}
/>
          <button
            onClick={handleSaveClick}
            disabled={!reportName}
            className={`rounded-xl text-sm font-medium transition-all flex items-center h-10 justify-center ${!reportName ? "bg-gray-300 cursor-not-allowed text-white" : "bg-blue-400 hover:bg-blue-700 text-white"
              }`}
            style={{ width: "108px", height: "40px", }}
          >
            Save Report
          </button>
        </div>
      </div>
      <ConfirmSaveView type="Report" />
    </header>
  );
}