import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { FilterMatchMode } from "primereact/api";
import { useState, useEffect } from "react";
import "../../../styles/primereact-table.css";

interface ColumnConfig {
  column_name: string;
  header?: string; // Optional custom header label
  sortable?: boolean; // Optional - whether column is sortable (default: true)
}

interface ProductDataTableProps {
  data: any[];
  globalFilter: string;
  columns: (ColumnConfig | { column_name: string })[];
}

export default function ProductDataTable({ 
  data, 
  globalFilter, 
  columns = [] 
}: ProductDataTableProps) {
  const [filters, setFilters] = useState({
    global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
  });
  
  const [first, setFirst] = useState(0);
  const rows = 5;
  
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / rows);
  const currentPage = Math.floor(first / rows) + 1;
  
  // Sliding window for page numbers
  const [pageWindowStart, setPageWindowStart] = useState(1);
  const maxVisiblePages = 5;

  // Update filters when globalFilter prop changes
  useEffect(() => {
    setFilters({
      global: { value: globalFilter, matchMode: FilterMatchMode.CONTAINS },
    });
    setFirst(0);
    setPageWindowStart(1);
  }, [globalFilter]);

  // Helper function to format header text (default formatting)
  const formatHeader = (headerText: string) => {
    if (!headerText) return '';
    return headerText
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Handle page change
  const onPageChange = (page: number) => {
    const newFirst = (page - 1) * rows;
    setFirst(newFirst);
    
    // Adjust sliding window
    if (page > pageWindowStart + maxVisiblePages - 1) {
      setPageWindowStart(page - maxVisiblePages + 1);
    } else if (page < pageWindowStart) {
      setPageWindowStart(page);
    }
  };

  // Handle Previous button
  const onPrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  // Handle Next button
  const onNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Generate visible page numbers
  const getVisiblePages = () => {
    const pages = [];
    const endPage = Math.min(pageWindowStart + maxVisiblePages - 1, totalPages);
    
    for (let i = pageWindowStart; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="w-full">
      <DataTable
        value={data}
        paginator
        rows={rows}
        first={first}
        onPage={(e) => setFirst(e.first)}
        dataKey={columns[0]?.column_name || 'id'}
        filters={filters}
        globalFilterFields={columns.map(col => col.column_name)}
        emptyMessage="No data available"
        sortMode="multiple"
        style={{ width: "92vw" }}
        className="custom-table"
        stripedRows
        rowClassName={() => "border-b border-gray-200"}
      >
        {columns.map((col) => {
          // Check if custom header is provided, otherwise use default formatting
          const headerLabel = 'header' in col && col.header ? col.header : formatHeader(col.column_name);
          // Check if sortable is explicitly set, otherwise default to true
          const isSortable = 'sortable' in col ? col.sortable : true;
          
          return (
            <Column
              style={{ whiteSpace: "nowrap", width: "auto" }}
              key={col.column_name}
              field={col.column_name}
              header={headerLabel}
              sortable={isSortable}
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
          );
        })}
      </DataTable>

      {/* Custom Pagination */}
      <div className="flex items-center justify-between px-4 py-1 bg-white border-t border-gray-200 rounded-b-xl">
        <div className="text-sm text-gray-600">
          Showing {first + 1} to {Math.min(first + rows, totalRecords)} of {totalRecords} results
        </div>
        
        <div className="flex items-center gap-1">
          {/* Previous Button */}
          <button
            onClick={onPrevious}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Previous
          </button>

          {/* Page Numbers */}
          {visiblePages.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[32px] h-[32px] text-sm font-medium rounded-md transition-all ${
                currentPage === page
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={onNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}