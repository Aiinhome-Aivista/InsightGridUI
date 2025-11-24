import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import "./primereact-table.css"

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

      {/* Filter Chips */}
      <div className="flex items-center gap-3 mb-6">
        <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200">
          SQL
        </span>
        <span className="bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200">
          Filter
        </span>
        <span className="flex items-center bg-gray-100 px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-200 gap-2">
          Product Filter
          <i className="pi pi-times text-gray-500 text-xs cursor-pointer"></i>
        </span>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 shadow-sm overflow-hidden bg-white">
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
          tableStyle={{ minWidth: "60rem" }}
          className="custom-table"
        >
          <Column field="sales" header="Sales" sortable />
          <Column field="product" header="Product" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column field="purchase" header="Purchase Amount" body={purchaseBody} />
        </DataTable>
      </div>
    </div>
  );
}
