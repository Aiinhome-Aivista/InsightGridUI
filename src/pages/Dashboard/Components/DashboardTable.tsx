import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import "./primereact-table.css";
import ChartSidebar from "./ChartSidebar";
import { useTheme } from "../../../theme";

interface DashboardTableProps {
  data: any[];
  globalFilter: string;
}

export default function DashboardTable({ data, globalFilter }: DashboardTableProps) {
  const { theme } = useTheme();
  const [isChartVisible, setIsChartVisible] = useState(false);

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
            {/* Left Title + Subtitle */}
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
 
            {/* Right Icons (Grid + Chart) */}
            <div className="flex items-center gap-2">
              <button onClick={() => setIsChartVisible(true)}
                className="p-2 rounded-md transition hover:bg-gray-500/10"
                style={{
                  backgroundColor: isChartVisible ? theme.border : "transparent",
                }}
              >
                <BarChartIcon sx={{ fontSize: "1.1rem", color: theme.secondaryText }} />
              </button>
              <button onClick={() => setIsChartVisible(false)}
                className="p-2 rounded-md transition hover:bg-gray-500/10"
                style={{
                  backgroundColor: !isChartVisible ? theme.border : "transparent",
                }}
              >
                <GridViewRoundedIcon sx={{ fontSize: "1.1rem", color: theme.secondaryText }} />
              </button>
            </div>
          </div>
 
          {/* Table */}
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
        </div>
      </div>
      {/* Right Sidebar */}
      {isChartVisible && <ChartSidebar onClose={() => setIsChartVisible(false)} theme={theme} />}
    </div>
  );
}
