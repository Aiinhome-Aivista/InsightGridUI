import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import SpeedIcon from '@mui/icons-material/Speed';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import { useState, useEffect } from 'react';
import { MultiSelect } from "primereact/multiselect";

interface ChartSidebarProps {
  columns: { column_name: string; label: string }[];
  rows: any[];
  columnTypes: Record<string, string>;
  onChartSelect: (config: any) => void;
  onClose?: () => void;
  selectedColumns: string[];                 // ✅ NEW
  onSelectedColumnsChange: (cols: string[]) => void; // ✅ NEW
}


interface ChartOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  subtitle: string;
}

export default function ChartSidebar({ onChartSelect, onClose, columns, columnTypes, rows, selectedColumns,
  onSelectedColumnsChange, }: ChartSidebarProps) {

  const chartOptions: ChartOption[] = [
    {
      id: 'bar',
      name: 'Bar Chart',
      icon: <BarChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    },
    {
      id: 'mixed',
      name: 'Mixed Chart',
      icon: <ShowChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Distribution'
    },
    {
      id: 'box',
      name: 'Box Plot',
      icon: <CandlestickChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Distribution'
    },
    {
      id: 'kpi',
      name: 'KPI',
      icon: <SpeedIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Key Metric'
    },
    {
      id: 'bubble',
      name: 'Bubble Chart',
      icon: <BubbleChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    },
    {
      id: 'pie',
      name: 'Pie Chart',
      icon: <PieChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    },
    {
      id: 'waterfall',
      name: 'Waterfall Chart',
      icon: <WaterfallChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    }
  ];
  const normalizeType = (t?: string, colName?: string) => {
    if (!t) return "text";

    // 👇 treat IDs as countable numeric
    if (
      ["int", "decimal"].includes(t) ||
      colName?.toLowerCase().endsWith("_id")
    ) {
      return "number";
    }

    if (t === "datetime") return "date";
    return "text";
  };
  const orderedSelected = selectedColumns.map(col => ({
    name: col,
    type: normalizeType(columnTypes?.[col], col)
  }));

  const typedSelected = selectedColumns.map(c => ({
    name: c,
    type: normalizeType(columnTypes?.[c])
  }));
  // const isChartDisabled = (chartId: string) => {
  //   const cols = orderedSelected;

  //   if (cols.length === 0) return true;

  //   switch (chartId) {

  //     case "bar":
  //     case "pie":
  //       return !(
  //         cols.length >= 2 &&
  //         cols[0].type === "text" &&
  //         cols[1].type === "number"
  //       );

  //     case "kpi":
  //       return !(
  //         cols.length === 1 &&
  //         cols[0].type === "number"
  //       );

  //     case "box":
  //       return !(
  //         cols.length === 1 &&
  //         cols[0].type === "number"
  //       );

  //     case "mixed":
  //       return !(
  //         cols.length >= 3 &&
  //         cols[0].type === "text" &&
  //         cols.slice(1).every(c => c.type === "number")
  //       );

  //     case "bubble":
  //       return !(
  //         cols.length >= 2 &&
  //         cols[0].type === "number" &&
  //         cols[1].type === "number"
  //       );

  //     case "waterfall":
  //       return !(
  //         cols.length >= 2 &&
  //         (cols[0].type === "text" || cols[0].type === "date") &&
  //         cols[1].type === "number"
  //       );

  //     default:
  //       return true;
  //   }
  // };

  const isChartDisabled = (chartId: string) => {
    const cols = orderedSelected;

    if (cols.length === 0) return true;

    switch (chartId) {
      case "bar":
      case "pie":
        return !(cols.length >= 1);

      case "kpi":
        return !(cols.length === 1);

      case "box":
        return !(cols.length === 1);

      case "mixed":
        return !(cols.length >= 2);

      case "bubble":
        return !(
          cols.length >= 2 &&
          cols.every(c => c.type === "number")
        );

      case "waterfall":
        return !(cols.length >= 1);

      default:
        return true;
    }
  };

  const autoAssignColumns = (chartType: string) => {
    const cols = orderedSelected;

    switch (chartType) {

      case "bar":
      case "pie":
        return {
          xAxis: cols[0].name,
          yAxis: cols[0].name,   // ✅ SAME COLUMN (COUNT)
          agg: "count"
        };



      case "kpi":
        return {
          value: cols[0].name,
          agg: "count"
        };

      case "box":
        return {
          xAxis: cols[0].name,
          agg: "count"
        };


      case "mixed":
        return {
          xAxis: cols[0].name,
          yAxis: cols.slice(1).map(c => c.name)
        };

      case "bubble":
        return {
          xAxis: cols[0].name,
          yAxis: cols[1].name,
          size: cols[2]?.name,
          label: cols[3]?.name
        };

      case "waterfall":
        return {
          xAxis: cols[0].name,
          agg: "count"   // ✅ শুধু এটুকু add করো
        };


      default:
        return null;
    }
  };




  const handleChartClick = (chartType: string) => {
    if (chartType !== "kpi" && selectedColumns.length === 0) return;

    const mapping = autoAssignColumns(chartType);
    if (!mapping) return;

    onChartSelect({
      type: chartType,
      ...mapping,
      rows
    });
  };




  return (
    <div className="fixed top-0 right-0 w-80 bg-white shadow-lg h-screen border-l overflow-y-auto z-50">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        {/* Title + Close */}
        <div className="flex justify-between items-center mb-2">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Recommended Graph
            </h3>
            {/* <p className="text-xs text-gray-500 mt-0.5">
              Table: Product Details
            </p> */}
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition"
              aria-label="Close sidebar"
            >
              <CloseIcon sx={{ fontSize: "1.25rem" }} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* MULTISELECT — FULL WIDTH */}
        <MultiSelect
          options={columns.map(c => ({
            label: c.label,
            value: c.column_name
          }))}
          value={selectedColumns}
          onChange={(e) => onSelectedColumnsChange(e.value)} // 🔥 single source
          placeholder="Select Column"
          display="chip"
          filter
          pt={{
            root: {
              className:
                "w-full bg-gray-50 border border-gray-200 rounded-2xl min-h-[56px] flex items-center hover:border-gray-300 focus-within:border-indigo-500"
            },

            label: {
              className: "text-gray-400 text-base px-4"
            },

            trigger: {
              className: "text-gray-500 px-4"
            },

            /* DROPDOWN PANEL */
            panel: {
              className:
                "rounded-2xl border border-gray-200 shadow-lg mt-2 bg-gray-50 overflow-hidden"
            },

            /* SEARCH WRAPPER */
            filterContainer: {
              className:
                "px-3 pt-3 pb-2 bg-gray-50 border-b border-gray-200 relative"
            },

            /* SEARCH INPUT */
            filterInput: {
              className:
                "w-full pl-9 pr-3 py-2 rounded-lg bg-white border border-gray-300 text-sm " +
                "focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            },

            /* OPTION LIST */
            list: {
              className: "pt-5 pb-3 bg-gray-50"
            },

            item: {
              className:
                "flex items-center gap-2 text-sm px-4 py-2 cursor-pointer hover:bg-gray-200 rounded-md"
            },

            token: {
              className:
                "bg-indigo-50 text-indigo-700 rounded-lg text-xs px-2 py-1"
            }
          }}





        />




      </div>

      <div className="p-4">
        <div className="flex flex-col gap-2">
          {chartOptions.map(chart => {
            const disabled = isChartDisabled(chart.id);

            return (
              <button
                key={chart.id}
                disabled={disabled}
                onClick={() => handleChartClick(chart.id)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg border transition text-left
          ${disabled
                    ? "opacity-40 cursor-not-allowed bg-gray-50"
                    : "bg-white hover:bg-blue-50 hover:border-blue-500"
                  }`}
              >
                {/* ICON */}
                <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-md">
                  {chart.icon}
                </div>

                {/* TEXT */}
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {chart.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {chart.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}