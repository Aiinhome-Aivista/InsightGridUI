import { useTheme } from "../../theme";

import { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";

import "primereact/resources/themes/lara-light-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function Dashboard_page() {
  const [globalFilter, setGlobalFilter] = useState("");

  const data = [
    { sales: "Python", product: "10 mints", customer: "17/10/2025", purchase: "Active" },
    { sales: "SQL", product: "22 mints", customer: "11/10/2025", purchase: "Active" },
    { sales: "JAVA", product: "7 mints", customer: "13/10/2025", purchase: "Active" },
  ];

  const purchaseBody = (row: any) => (
    <Tag
      value={row.purchase}
      className="bg-green-100 text-green-600 px-3 py-1 rounded-full border-none text-sm"
    />
  );

  return (
    <div className="w-full p-8">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-semibold">Tabular view</h1>
        <p className="text-gray-500 text-sm">
          Start by uploading a data file to create your first view.
        </p>
      </div>

      {/* SEARCH + ICONS */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-3 w-full">
          <div className="relative w-full">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <InputText
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Global Search"
              className="pl-10 w-full h-11 rounded-xl border-gray-300"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <i className="pi pi-cog text-gray-600"></i>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100">
            <i className="pi pi-refresh text-gray-600"></i>
          </button>
        </div>
      </div>

      {/* FILTER CHIPS */}
      <div className="flex items-center gap-3 mt-4">
        <span className="bg-gray-100 px-4 py-1 rounded-lg text-sm">SQL</span>
        <span className="bg-gray-100 px-4 py-1 rounded-lg text-sm">Filter</span>

        <span className="flex items-center bg-gray-100 px-4 py-1 rounded-lg text-sm gap-1">
          Product Filter
          <i className="pi pi-times text-gray-500 text-xs"></i>
        </span>
      </div>

      {/* MAIN TABLE */}
      <div className="mt-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <DataTable
          value={data}
          paginator={false}
          rows={5}
          className="custom-table"
          globalFilter={globalFilter}
          filters={{
            global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
          }}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="sales" header="Sales" sortable />
          <Column field="product" header="Product" sortable />
          <Column field="customer" header="Customer" sortable />
          <Column
            field="purchase"
            header="Purchase Amount"
            body={purchaseBody}
          />
        </DataTable>
      </div>
    </div>
  );
}
