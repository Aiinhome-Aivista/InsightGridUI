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
   <div style={{ maxWidth: "100%", overflow: "auto" }}>
<DataTable
    value={data}
    globalFilter={globalFilter}
    sortMode="multiple"
    scrollable
    scrollHeight="200px"
    style={{ maxWidth: "1370px" }}
    filters={{
      global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
    }}
    className="custom-table mb-5"
    stripedRows
    
    // 1. Remove or set showGridlines to false to avoid vertical lines
    showGridlines={true} 
    
    // 2. Add this to create the divider line
    rowClassName={() => "border-b border-gray-200"} 
  >
  

      {columns.map((col) => (
        <Column
          key={col.column_name}
          field={col.column_name}
          header={formatHeader(col.column_name)}
          sortable
        />
      ))}
    </DataTable>
    </div>
  );
}
