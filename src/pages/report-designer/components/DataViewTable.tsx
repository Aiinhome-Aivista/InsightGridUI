import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { Tag } from "primereact/tag";

import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import Tippy from "@tippyjs/react";

import "../../../styles/tippy-theme.css";
import "../../../styles/primereact-table.css";

import ChartSidebar from "../components/ChartSidebar";
// import RenderCharts from "../../Dashboard/Components/RenderCharts";
import AnimatedToggleButton from "../../Dashboard/Components/AnimatedToggleButton";

// import { ProcedureCodeBlock, ProcedureToggleButton } from "./SpDropDown";
import { useTheme } from "../../../theme";
import { ProcedureCodeBlock, ProcedureToggleButton } from "./SpDropDown";
import RenderCharts from "./render-charts";

interface DashboardTableProps {
  allData: { [key: string]: any }; // tables: { paid_orders: {...}, electronics_orders: {...} }
  selectedTables: string[];
  globalFilter: string;
}

export default function DashboardTable({
  allData,
  selectedTables,
  globalFilter,
}: DashboardTableProps) {
  const { theme } = useTheme();

  // -------------------------------------------------------
  // ⭐ PER-TABLE STATE (EVERY TABLE IS INDEPENDENT!)
  // -------------------------------------------------------
  const [showProcedure, setShowProcedure] = useState<{
    [key: string]: boolean;
  }>({});
  const [toggleSelection, setToggleSelection] = useState<{
    [key: string]: number;
  }>({});
  const [showChartView, setShowChartView] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedCharts, setSelectedCharts] = useState<{
    [key: string]: string[];
  }>({});
  const [isChartVisible, setIsChartVisible] = useState<{
    [key: string]: boolean;
  }>({});

  // -------------------------------------------------------
  // Helper Body Renderer
  // -------------------------------------------------------
  const getSeverity = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return null;
    }
  };

  const statusBodyTemplate = (rowData: any) => {
    const status = rowData.payment_status;
    if (!status) return null;
    return <Tag value={status} severity={getSeverity(status)} />;
  };

  return (
    <div>
      {selectedTables.map((tableKey) => {
        const table = allData[tableKey];
        if (!table) return null;

        // -------------------------------------------------------
        // Load per-table state values
        // -------------------------------------------------------
        const procedureVisible = showProcedure[tableKey] ?? true;
        const chartSidebarVisible = isChartVisible[tableKey] ?? false;
        const charts = selectedCharts[tableKey] ?? [];
        const toggle = toggleSelection[tableKey] ?? 1;
        const showCharts = showChartView[tableKey] ?? false;

        return (
          <div key={tableKey} className="p-6 px-4">
            <div className="rounded-xl shadow-xs p-4 bg-white">
              {/* ------------------------------------------------ HEADER ------------------------------------------------ */}
              <div className="flex items-start justify-between mb-4">
                {/* LEFT: Title */}
                <div>
                  <h2
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: theme.primaryText }}
                  >
                    <GridViewRoundedIcon
                      sx={{ fontSize: "1rem", color: theme.primaryText }}
                    />
                    {table.title}
                  </h2>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.secondaryText }}
                  >
                    This displays all {table.title.toLowerCase()} details.
                  </p>
                </div>

                {/* RIGHT: Buttons */}
                <div className="flex items-center gap-3">
                  {/* Procedure Toggle */}
                  {/* <ProcedureToggleButton
                    isOpen={procedureVisible}
                    onToggle={() =>
                      setShowProcedure((prev) => ({
                        ...prev,
                        [tableKey]: !procedureVisible,
                      }))
                    }
                  /> */}

                  {/* Table / Chart Toggle */}
                  {/* <AnimatedToggleButton
                    options={[
                      {
                        icon: (
                          <Tippy content="Chart View">
                            <BarChartIcon />
                          </Tippy>
                        ),
                        value: "chart",
                      },
                      {
                        icon: (
                          <Tippy content="Table View">
                            <GridViewRoundedIcon />
                          </Tippy>
                        ),
                        value: "table",
                      },
                    ]}
                    defaultSelected={toggle}
                    onChange={(selectedIndex, value) => {
                      setToggleSelection((prev) => ({
                        ...prev,
                        [tableKey]: selectedIndex,
                      }));

                      if (value === "chart") {
                        setIsChartVisible((prev) => ({
                          ...prev,
                          [tableKey]: true,
                        }));

                        if (charts.length > 0) {
                          setShowChartView((prev) => ({
                            ...prev,
                            [tableKey]: true,
                          }));
                        }
                      } else {
                        setIsChartVisible((prev) => ({
                          ...prev,
                          [tableKey]: false,
                        }));
                        setShowChartView((prev) => ({
                          ...prev,
                          [tableKey]: false,
                        }));
                      }
                    }}
                  /> */}
                </div>
              </div>

              {/* ------------------------------------------------ PROCEDURE SQL ------------------------------------------------ */}
              {/* <ProcedureCodeBlock
                isVisible={procedureVisible}
                sql={table.procedure_sql}
              /> */}

              {/* ------------------------------------------------ TABLE OR CHART VIEW ------------------------------------------------ */}
              {showCharts && charts.length > 0 ? (
                <RenderCharts
                  selectedCharts={charts}
                  onRemoveChart={(chartType) => {
                    const updated = charts.filter((c) => c !== chartType);

                    setSelectedCharts((prev) => ({
                      ...prev,
                      [tableKey]: updated,
                    }));

                    if (updated.length === 0) {
                      setShowChartView((prev) => ({
                        ...prev,
                        [tableKey]: false,
                      }));
                      setToggleSelection((prev) => ({
                        ...prev,
                        [tableKey]: 1,
                      }));
                    }
                  }}
                />
              ) : (
                <DataTable
                  value={table.rows}
                  paginator={false}
                  rows={10}
                  sortMode="multiple"
                  scrollable
                  scrollHeight="200px"
                  style={{ maxWidth: "1330px" }}
                  filters={{
                    global: {
                      value: globalFilter,
                      matchMode: FilterMatchMode.CONTAINS,
                    },
                  }}
                  className="custom-table"
                >
                  {/* Dynamic Columns */}
                  {table.columns.map((col: { column_name: string }, index: number) => (
                    <Column
                      key={index}
                      field={col.column_name}
                      header={col.column_name.replace(/_/g, " ").toUpperCase()}
                      body={col.column_name === 'payment_status' ? statusBodyTemplate : null}
                    />
                  ))}
                </DataTable>
              )}
            </div>

            {/* ------------------------------------------------ CHART SIDEBAR ------------------------------------------------ */}
            {/* {chartSidebarVisible && (
              <ChartSidebar
                onChartSelect={(chartSelection) => {
                  setSelectedCharts((prev) => ({
                    ...prev,
                    [tableKey]: chartSelection,
                  }));

                  if (chartSelection.length > 0) {
                    setShowChartView((prev) => ({ ...prev, [tableKey]: true }));
                  }
                }}
                selectedCharts={charts}
                onClose={() =>
                  setIsChartVisible((prev) => ({ ...prev, [tableKey]: false }))
                }
              />
            )} */}
          </div>
        );
      })}
    </div>
  );
}