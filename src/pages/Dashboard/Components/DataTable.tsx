import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import "../../../styles/primereact-table.css";

interface ProductDataTableProps {
  data: any[];
  globalFilter: string;
  columns: { column_name: string }[];
}

export default function ProductDataTable({ data, globalFilter, columns = [] }: ProductDataTableProps) {
  // Helper function to format header text
  const formatHeader = (headerText: string) => {
    if (!headerText) return '';
    return headerText
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <DataTable
      value={data}
      globalFilter={globalFilter}
      sortMode="multiple"
      emptyMessage="No data available for this table."
      scrollable
      scrollHeight="200px"
      style={{ width: "100%" }}
      filters={{
        global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
      }}
      className="custom-table"
      stripedRows
      rowClassName={() => "border-b border-gray-200"}
    >
      {columns.map((col) => (
        <Column
          style={{ whiteSpace: "nowrap", width: "auto" }}
          key={col.column_name}
          field={col.column_name}
          header={formatHeader(col.column_name)}
          sortable
          headerStyle={{
            fontSize: '15px',
            fontWeight: 600,
            color: '#3D5B81'
          }}
          bodyStyle={{
            fontSize: '14px',
            fontWeight: 400
          }}
        />
      ))}
    </DataTable>
  );
}