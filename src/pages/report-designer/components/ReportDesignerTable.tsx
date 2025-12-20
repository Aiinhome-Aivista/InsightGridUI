import { useState } from "react";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import { useTheme } from "../../../theme";
import ProductDataTable from "../../query-designer/components/DataTable";
interface DataViewTableProps {
  allData: { [key: string]: any };
  selectedTables: string[];
  globalFilter: string;
}
export default function DataViewTable({
  allData,
  selectedTables,
  globalFilter,
}: DataViewTableProps) {
  const { theme } = useTheme();
  return (
    <div>
      {selectedTables.map((tableKey) => {
        const table = allData[tableKey];
        if (!table) return null;
        const columns = table.columns?.map((col: { column_name: string }) => ({
          column_name: col.column_name,
          header: col.column_name.replace(/_/g, ' ').toUpperCase(),
          sortable: true,
        })) || [];

        return (
          <div key={tableKey} className="px-4 pb-6">
            <div className="rounded-xl shadow-xs p-4 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: theme.primaryText }}
                  >
                    <GridViewRoundedIcon
                      sx={{ fontSize: "1rem", color: theme.primaryText }}
                    />
                    {table.title}
                  </h2>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.secondaryText }}
                  >
                    This displays {table.title.toLowerCase()} details.
                  </p>
                </div>
              </div>
              <ProductDataTable
                data={table.rows || []}
                globalFilter={globalFilter}
                showPagination={true}
                columns={columns}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}