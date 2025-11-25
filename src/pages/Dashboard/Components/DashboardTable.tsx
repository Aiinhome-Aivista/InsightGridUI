import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import "./primereact-table.css";

interface DashboardTableProps {
  data: any[];
  globalFilter: string;
}

export default function DashboardTable({ data, globalFilter }: DashboardTableProps) {
  const purchaseBody = (row: any) => (
    <Tag
      value={row.purchase}
      className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium border-none"
    />
  );

  return (
    <div className="p-6">
      {/* Card Container */}
      <div className="rounded-xl shadow-xs bg-white p-4">

        {/* Header Section (Same as Screenshot) */}
        <div className="flex items-start justify-between mb-4">
          
          {/* Left Title + Subtitle */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
              <GridViewRoundedIcon sx={{ fontSize: "1rem" }} />
              Product Details
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              This table is showing all product details
            </p>
          </div>

          {/* Right Icons (Grid + Chart) */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md hover:bg-gray-100 transition">
              <BarChartIcon className="text-gray-500" sx={{ fontSize: "1.1rem" }} />
            </button>
            <button className="p-2 rounded-md hover:bg-gray-100 transition">
              <GridViewRoundedIcon className="text-gray-500" sx={{ fontSize: "1.1rem" }} />
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
  );
}
