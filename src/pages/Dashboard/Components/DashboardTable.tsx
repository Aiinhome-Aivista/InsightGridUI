import { useState } from "react";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import Tippy from '@tippyjs/react';
import "tippy.js/dist/tippy.css";
import "../../../styles/tippy-theme.css";
import { useTheme } from "../../../theme";
import ChartSidebar from "./ChartSidebar";
import RenderCharts from "./render-charts";
import AnimatedToggleButton from "../../../Modal/components/animated-toggle-button";
import ProductDataTable from "../Components/DataTable";

interface DashboardTableProps {
  data: any[];
  globalFilter: string;
}

export default function DashboardTable({ data, globalFilter }: DashboardTableProps) {
  const { theme } = useTheme();
  const [isChartVisible, setIsChartVisible] = useState(false);
  const [selectedCharts, setSelectedCharts] = useState<string[]>([]);
  const [toggleSelection, setToggleSelection] = useState(1);
  const [showChartView, setShowChartView] = useState(false);

  const handleRemoveChart = (chartType: string) => {
    const newCharts = selectedCharts.filter(chart => chart !== chartType);
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

  return (
    <div className="p-6">
      <div className="rounded-xl shadow-xs p-4" style={{ backgroundColor: theme.surface }}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.primaryText }}>
              <GridViewRoundedIcon sx={{ fontSize: "1rem", color: theme.primaryText }} />
              Product Details
            </h2>
            <p className="text-xs mt-1" style={{ color: theme.secondaryText }}>
              This table is showing all product details
            </p>
          </div>

          {/* Toggle */}
          <AnimatedToggleButton
            options={[
                { label: "Meta Data", value: 'data' },
                { label: "Table View", value: 'table' },
                { label: "Insight", value: 'chart' },
           
            ]}
            defaultSelected={toggleSelection}
            onChange={(i, value) => {
              setToggleSelection(i);
              if (value === 'chart') {
                setIsChartVisible(true);
                if (selectedCharts.length > 0) setShowChartView(true);
              } else {
                setIsChartVisible(false);
                setShowChartView(false);
              }
            }}
            mode="text"
          />
        </div>

        {/* CONDITIONAL RENDER */}
        {showChartView && selectedCharts.length > 0 ? (
          <RenderCharts selectedCharts={selectedCharts} onRemoveChart={handleRemoveChart} />
        ) : (
          <ProductDataTable data={data} globalFilter={globalFilter} />  // <-- NEW COMPONENT
        )}
      </div>

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
