import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import "../../../styles/tippy-theme.css";
import "../../Dashboard/Components/primereact-table.css";
import ChartSidebar from "../../Dashboard/Components/ChartSidebar";
import { useTheme } from "../../../theme";
import RenderCharts from "../../Dashboard/Components/render-charts";
import AnimatedToggleButton from "../../../Modal/components/animated-toggle-button";
import { ProcedureCodeBlock, ProcedureToggleButton } from "./SpDropDown";


interface DashboardTableProps {
  allData: { [key: string]: any[] };
  selectedTables: string[];
  globalFilter: string;
}

export default function DashboardTable({
  allData,
  selectedTables,
  globalFilter,
}: DashboardTableProps) {
  const { theme } = useTheme();
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [toggleSelection, setToggleSelection] = useState(1);
  const [showChartView, setShowChartView] = useState(false);
  
  // State for Procedure View (Default is true as requested)
  const [showProcedure, setShowProcedure] = useState(true);

  const handleRemoveChart = (chartType: string) => {
    const newCharts = selectedCharts.filter((chart) => chart !== chartType);
    setSelectedCharts(newCharts);

    if (newCharts.length === 0) {
      setShowChartView(false);
      setToggleSelection(1);
    }
  };

  const handleSidebarClose = () => {
    setIsChartVisible(false);
    if (selectedCharts.length === 0) {
      setToggleSelection(1);
      setShowChartView(false);
    }
  };

  const purchaseBody = (row: any) => (
    <Tag
      value={row.purchase}
      className="px-4 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium border-none"
    />
  );

  return (
    <div>
      {selectedTables.map((tableKey) => {
        const tableData = allData[tableKey] || [];
        const tableName = tableKey
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase());

        return (
          <div key={tableKey} className="p-6 px-4 ">
            <div className="rounded-xl shadow-xs p-4 bg-white">
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: theme.primaryText }}
                  >
                    <GridViewRoundedIcon
                      sx={{ fontSize: "1rem", color: theme.primaryText }}
                    />
                    {tableName}
                  </h2>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.secondaryText }}
                  >
                    This table is showing all {tableName.toLowerCase()} details
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  
                  {/* COMPONENT: Procedure Toggle Button */}
                  <ProcedureToggleButton 
                    isOpen={showProcedure} 
                    onToggle={() => setShowProcedure(!showProcedure)} 
                  />

                  <AnimatedToggleButton
                    options={[
                      {
                        icon: (
                          <Tippy content="Chart View" theme="gray" placement="bottom">
                            <BarChartIcon />
                          </Tippy>
                        ),
                        value: "chart",
                      },
                      {
                        icon: (
                          <Tippy content="Table View" theme="gray" placement="bottom">
                            <GridViewRoundedIcon />
                          </Tippy>
                        ),
                        value: "table",
                      },
                    ]}
                    defaultSelected={toggleSelection}
                    onChange={(selectedIndex, value) => {
                      setToggleSelection(selectedIndex);
                      if (value === "chart") {
                        setIsChartVisible(true);
                        if (selectedCharts.length > 0) setShowChartView(true);
                      } else {
                        setIsChartVisible(false);
                        setShowChartView(false);
                      }
                    }}
                    width="auto"
                    height="auto"
                    buttonPadding="0.5rem 0.6rem"
                    backgroundColor="#f3f4f6"
                    activeBackgroundColor="#ffffff"
                    textColor="#6b7280"
                    activeTextColor="#111827"
                    iconSize="1.2rem"
                    iconPosition="left"
                    mode="icon"
                  />
                </div>
              </div>

              {/* COMPONENT: Procedure Code Content */}
              <ProcedureCodeBlock isVisible={showProcedure} />

              {/* Chart vs Table View Logic */}
              {showChartView && selectedCharts.length > 0 ? (
                <RenderCharts
                  selectedCharts={selectedCharts}
                  onRemoveChart={handleRemoveChart}
                />
              ) : (
                <DataTable
                  value={tableData}
                  paginator={false}
                  rows={10}
                  sortMode="multiple"
                  scrollable
                  scrollHeight="200px"
                  style={{ maxWidth: "1370px" }}
                  globalFilter={globalFilter}
                  filters={{
                    global: {
                      value: globalFilter,
                      matchMode: FilterMatchMode.CONTAINS,
                    },
                  }}
                  className="custom-table"
                >
                  <Column field="sales" header="Sales" />
                  <Column field="product" header="Product" />
                  <Column field="customer" header="Customer" />
                  <Column field="purchase" header="Purchase Amount" body={purchaseBody} />
                </DataTable>
              )}
            </div>
          </div>
        );
      })}

      {isChartVisible && (
        <ChartSidebar
          onChartSelect={(charts) => {
            setSelectedCharts(charts);
            if (charts.length > 0) setShowChartView(true);
          }}
          onClose={handleSidebarClose}
          selectedCharts={selectedCharts}
        />
      )}
    </div>
  );
}