import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import "./primereact-table.css";

interface ProductDataTableProps {
  data: any[];
  globalFilter: string;
  columns: { column_name: string }[];
}

export default function ProductDataTable({ data, globalFilter, columns = [] }: ProductDataTableProps) {
  return (
    <DataTable
      value={data}
      globalFilter={globalFilter}
      sortMode="multiple"
      scrollable
      scrollHeight="400px"
      style={{ width: '100%' }}
      filters={{
        global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
      }}
      className="custom-table"
    >
      {columns.map((col) => (
        <Column
          key={col.column_name}
          field={col.column_name}
          header={col.column_name}
          sortable
        />
      ))}
    </DataTable>
  );
}
