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
  editReport

}) {
  const navigate = useNavigate();
  const { setIsConfirmSaveModalOpen, setViewName, setConfirmSaveAction } =
    useAuth();
  const dropdownRef = useRef<Dropdown>(null);
  const { theme } = useTheme();
  const trimToWords = (text, count = 3) => {
    const words = text.split(" ");
    return words.length > count
      ? words.slice(0, count).join(" ") + "..."
      : text;
  };

  const itemTemplate = (option) => {
    if (!option) return null;
    return (
      <Tippy content={option.label} theme="gray" placement="top-start">
        <div className="truncate max-w-[250px]">
          {trimToWords(option.label, 3)}
        </div>
      </Tippy>
    );
  };

  useEffect(() => {
    if (editReport) {
      console.log(" Edit report in header:", editReport);
    }
  }, [editReport]);

  // useEffect(() => {
  //   if (editReport && tableOptions.length > 0) {
  //     const queryName = editReport.query?.query_name;

  //     const matchedOption = tableOptions.find(
  //       (opt) => opt.label === queryName
  //     );

  //     if (matchedOption) {
  //       setSelectedTables([matchedOption]);

  //       // Optional: auto run script
  //       onRunScript?.(matchedOption.value);
  //     }
  //   }
  // }, [editReport, tableOptions]);
  const isEditMode = !!editReport;

  useEffect(() => {
    if (!isEditMode || tableOptions.length === 0) return;

    const queryName = editReport?.query?.query_name;
    if (!queryName) return;

    const matchedOption = tableOptions.find(
      (opt) => opt.label === queryName
    );

    if (matchedOption) {
      // VERY IMPORTANT
      setSelectedTables([matchedOption.value]);

      // auto load table
      onRunScript?.(matchedOption.value);
    }
  }, [isEditMode, editReport, tableOptions]);


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
    <header className="p-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between h-auto md:h-20 py-4 md:py-0">
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
                  Report Designer
                </h1>
                <p
                  className="text-sm mt-1"
                  style={{ color: theme.secondaryText }}
                >
                  {" "}
                  Start by uploading a data file to create your first view.
                </p>{" "}
              </div>
            </div>
          </div>
        </div>
        {/* SEARCH */}
        <div className="relative w-full md:w-1/3 my-3 md:my-0 text-gray-500">
          <SearchRoundedIcon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-full h-10 rounded-xl border focus:outline-none focus:ring-0"
            placeholder="Global Search"
          />
        </div>
        <div>
          <input
            type="text"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            placeholder="Write a report name(required)"
            className=" px-4 w-full md:w-80 min-h-[42px] h-auto border border-[#E5E5E5] rounded-xl text-gray-600 text-sm flex flex-wrap content-center items-center bg-white shadow-sm hover:border-gray-300 focus:outline-none focus:ring-0 gap-1 pr-10"
          />
        </div>
        <div className="flex items-start md:items-center justify-center gap-3 md:gap-4">
          <Dropdown
            value={
              Array.isArray(selectedTables) && selectedTables.length > 0
                ? selectedTables[0]
                : null
            }
            options={tableOptions}
            placeholder="Select a View"
            optionLabel="label"
            optionValue="value"
            onShow={handleDropdownShow}
            onHide={handleDropdownHide}
            ref={dropdownRef}
            itemTemplate={itemTemplate}
            onChange={(e) => {
              const val = e.value;
              setSelectedTables(val ? [val] : []);
              if (val) onRunScript(val); // 👈 UI load here
            }}
            className="w-full md:w-80 min-h-[42px] h-auto border border-[#E5E5E5] rounded-xl text-gray-600 text-sm bg-white shadow-sm"
            panelClassName="bg-white rounded-xl shadow-xl border border-gray-100"
          />

          <button
            onClick={handleSaveClick}
            disabled={!reportName}
            className={`rounded-lg text-sm font-medium transition-all flex items-center justify-center ${!reportName ? "bg-gray-300 cursor-not-allowed text-white" : "bg-blue-400 hover:bg-blue-700 text-white"
              }`}
            style={{ width: "108px", height: "40px" }}
          >
            Save Report
          </button>
        </div>
      </div>
      <ConfirmSaveView type="Report" />
    </header>
  );
}
