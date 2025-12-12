
import { useState, useRef } from "react";
import { MultiSelect } from "primereact/multiselect";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../../../styles/tippy-theme.css";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ForumIcon from "@mui/icons-material/Forum";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { InputText } from "primereact/inputtext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../theme";

export default function DataViewHeader({
  globalFilter,
  setGlobalFilter,
  selectedTables,
  setSelectedTables,
  tableOptions,
  onRefresh,
  onRunScript,   
  isRefreshing,
}) {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const multiSelectRef = useRef(null);
  const trimToWords = (text, count = 3) => {
  const words = text.split(" ");
  return words.length > count
    ? words.slice(0, count).join(" ") + "..."
    : text;
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


  // --- Template for selected chip ---
  const selectedItemTemplate = (value) => {
    // const opt = tableOptions.find((o) => o.value === value);
    const opt = Array.isArray(tableOptions)
      ? tableOptions.find((o) => o.value === value)
      : null;

    if (!opt) return null;

    return (
   <Tippy content={opt.label} theme="gray" placement="top">
  <div className="group inline-flex items-center bg-[#F3F4F6] text-[#4B5563] rounded-2xl px-2 py-0.5 text-xs font-medium border border-gray-200 mr-1 mb-1">
    <span className="truncate max-w-[120px]">{trimToWords(opt.label, 2)}</span>
    ...
  
          <div
            className="ml-1.5 cursor-pointer flex items-center justify-center w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200 text-gray-400 hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTables(selectedTables.filter((s) => s !== value));
            }}
          >
            <CloseRoundedIcon style={{ fontSize: "12px" }} />
          </div>
        </div>
      </Tippy>
    );
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
                  Query Designer
                </h1>
          <p className="text-sm mt-1" style={{ color: theme.secondaryText }}>
            {" "}
            Start by uploading a data file to create your first view.
          </p>{" "}
        </div>
 </div>
  </div>
   </div>
        {/* SEARCH */}
        <div className="relative w-full md:w-1/2 my-3 md:my-0 text-gray-500">
          <SearchRoundedIcon className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <InputText
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-10 w-full h-10 rounded-xl border focus:outline-none focus:ring-0"
            placeholder="Global Search"
          />
        </div>
        <div className="flex items-start md:items-center justify-center gap-3 md:gap-4">
          <MultiSelect
            ref={multiSelectRef}
            value={selectedTables}
            options={tableOptions}
            optionLabel="label"
            optionValue="value"
            display="chip"
            placeholder="Select Views"
            // onChange={(e) => setSelectedTables(e.value)}
            onShow={handleDropdownShow}
            onHide={handleDropdownHide}
            selectedItemTemplate={selectedItemTemplate}
            itemTemplate={itemTemplate}
             onChange={(e) => {
    setSelectedTables(e.value);

    const selectedSql = e.value[0]; // because MultiSelect = array

    if (selectedSql) {
      onRunScript(selectedSql); // 👉 CALL API HERE
    }
  }}
            
            className="w-full md:w-80 min-h-[42px] h-auto border border-[#E5E5E5] rounded-xl text-gray-600 text-sm flex flex-wrap content-center items-center bg-white shadow-sm hover:border-gray-300 focus:outline-none focus:ring-0 gap-1 pr-10
"
            style={{ padding: "4px 8px" }}
            panelClassName="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden mt-1"
              pt={{
                      wrapper: { className: "max-h-64 overflow-auto custom-scrollbar" },
                      header: { className: "p-1 bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-700" },
                      item: { className: "p-3 hover:bg-gray-50 text-sm text-gray-700 transition-colors cursor-pointer" },
                      labelContainer: { className: "flex flex-wrap gap-1 rounded-5xl  items-center flex-2" },
                      trigger: { className: "w-8 text-gray-400 flex rounded-5xl items-center justify-center" }
                  }}
          />

          {/* Chat */}
          {/* <div
            className="border rounded-xl p-2 cursor-pointer"
            onClick={() => navigate("/layout/chatScreen")}
          >
            <ForumIcon />
          </div> */}

          {/* Refresh */}
          <div
            className="border rounded-xl p-2 cursor-pointer"
            onClick={onRefresh}
          >
            <AutorenewRoundedIcon className={isRefreshing ? "animate-spin" : ""} />
          </div>
        </div>
      </div>
    </header>
  );
}
