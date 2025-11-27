import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState, useEffect } from "react";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import "./primereact-table.css";
import ChartSidebar from "./ChartSidebar";
import { useTheme } from "../../../theme";
import RenderCharts from "./render-charts";
import AnimatedToggleButton from "../../../Modal/components/animated-toggle-button";

interface DashboardTableProps {
  data: any[];
  globalFilter: string;
}

export default function DashboardTable({ data, globalFilter }: DashboardTableProps) {
  const { theme } = useTheme();
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [toggleSelection, setToggleSelection] = useState(1); // 0 = chart, 1 = table
  const [showChartView, setShowChartView] = useState(false); // NEW: Controls what to display

  const handleRemoveChart = (chartType: string) => {
    const newCharts = selectedCharts.filter(chart => chart !== chartType);
    setSelectedCharts(newCharts);
    
    // If no charts left, switch to table view
    if (newCharts.length === 0) {
      setShowChartView(false);
      setToggleSelection(1);
    }
  };

  const handleSidebarClose = () => {
    setIsChartVisible(false);
    
    // FIX 1: If no charts were selected, revert to table view
    if (selectedCharts.length === 0) {
      setToggleSelection(1);
      setShowChartView(false);
    }
  };

  const purchaseBody = (row: any) => (
    <Tag
      value={row.purchase}
      className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium border-none"
    />
  );

  return (
    <div>
      <div className="p-6">
        {/* Card Container */}
        <div
          className="rounded-xl shadow-xs p-4"
          style={{ backgroundColor: theme.surface }}
        >
          {/* Header Section (Same as Screenshot) */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2
                className="text-sm font-semibold flex items-center gap-2"
                style={{ color: theme.primaryText }}
              >
                <GridViewRoundedIcon sx={{ fontSize: "1rem", color: theme.primaryText }} />
                Product Details
              </h2>
              <p className="text-xs mt-1" style={{ color: theme.secondaryText }}>
                This table is showing all product details
              </p>
            </div>
            <div className="flex items-center gap-2">
              <AnimatedToggleButton
                options={[
                  { icon: <BarChartIcon />, value: 'chart' },
                  { icon: <GridViewRoundedIcon />, value: 'table' },
                ]}
                defaultSelected={toggleSelection}
                onChange={(selectedIndex: number, value: string | number) => {
                  setToggleSelection(selectedIndex);
                  if (value === 'chart') {
                    setIsChartVisible(true);
                    // If charts exist, show them
                    if (selectedCharts.length > 0) {
                      setShowChartView(true);
                    }
                  } else {
                    // FIX 2: When switching to table view, hide charts and close sidebar
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

          {/* FIX 2: Show Charts only when showChartView is true AND charts exist */}
          {showChartView && selectedCharts.length > 0 ? (
            <RenderCharts selectedCharts={selectedCharts} onRemoveChart={handleRemoveChart} />
          ) : (
            <DataTable
              value={data}
              paginator={false}
              rows={10}
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

      {/* Sidebar appears when chart icon clicked */}
      {isChartVisible && (
        <ChartSidebar
          onChartSelect={(charts) => {
            setSelectedCharts(charts);
            // When charts are selected, show them
            if (charts.length > 0) {
              setShowChartView(true);
            }
          }}
          onClose={handleSidebarClose}
          selectedCharts={selectedCharts} // FIX 3: Pass selected charts to sidebar
        />
      )}
    </div>
  );
}