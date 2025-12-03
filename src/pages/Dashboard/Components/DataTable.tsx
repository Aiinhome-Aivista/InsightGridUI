import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { FilterMatchMode } from "primereact/api";
import "./primereact-table.css";

interface ProductDataTableProps {
  data: any[];
  globalFilter: string;
}

export default function ProductDataTable({ data, globalFilter }: ProductDataTableProps) {
  const purchaseBody = (row: any) => (
    <Tag
      value={row.purchase}
      className="px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium border-none"
    />
  );

  return (
    <DataTable
      value={data}
      paginator={false}
      rows={10}
      globalFilter={globalFilter}
      filters={{
        global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
      }}
      className="custom-table"
    >
      <Column field="sales" header="Sales" />
      <Column field="product" header="Product" />
      <Column field="customer" header="Customer" />
      <Column field="purchase" header="Purchase Amount" body={purchaseBody} />
    </DataTable>
  );
}
