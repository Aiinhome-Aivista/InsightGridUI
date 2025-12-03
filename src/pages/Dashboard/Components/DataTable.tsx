import { useState } from "react";
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
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(5);

  const onPageChange = (event: { first: number, rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
   <DataTable
  value={data}
  paginator
  rows={rows}
  first={first}
  onPage={onPageChange}
  rowsPerPageOptions={[5,10, 15,20,25, 30]}
  globalFilter={globalFilter}
  sortMode="multiple"
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
