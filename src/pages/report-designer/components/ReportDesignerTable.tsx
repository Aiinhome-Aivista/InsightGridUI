// import { useState } from "react";
// import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
// import { useTheme } from "../../../theme";
// import ProductDataTable from "../../query-designer/components/DataTable";
// interface DataViewTableProps {
//   allData: { [key: string]: any };
//   selectedTables: string[];
//   globalFilter: string;
// }
// export default function DataViewTable({
//   allData,
//   selectedTables,
//   globalFilter,
// }: DataViewTableProps) {
//   const { theme } = useTheme();
//   return (
//     <div>
//       {selectedTables.map((tableKey) => {
//         const table = allData[tableKey];
//         if (!table) return null;
//         const columns = table.columns?.map((col: { column_name: string }) => ({
//           column_name: col.column_name,
//           header: col.column_name.replace(/_/g, ' ').toUpperCase(),
//           sortable: true,
//         })) || [];

//         return (
//           <div key={tableKey} className="px-4 pb-6">
//             <div className="rounded-xl shadow-xs p-4 bg-white">
//               <div className="flex items-start justify-between mb-4">
//                 <div>
//                   <h2
//                     className="text-sm font-semibold flex items-center gap-2"
//                     style={{ color: theme.primaryText }}
//                   >
//                     <GridViewRoundedIcon
//                       sx={{ fontSize: "1rem", color: theme.primaryText }}
//                     />
//                     {table.title}
//                   </h2>
//                   <p
//                     className="text-xs mt-1"
//                     style={{ color: theme.secondaryText }}
//                   >
//                     This displays {table.title.toLowerCase()} details.
//                   </p>
//                 </div>
//               </div>
//               <ProductDataTable
//                 data={table.rows || []}
//                 globalFilter={globalFilter}
//                 showPagination={true}
//                 columns={columns}
//               />
//             </div>
//           </div>
//         );
//       })}
//     </div>
//   );
// }

import { useState } from "react";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
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
  const [viewType, setViewType] = useState<"table" | "chart">("table");

  return (
    <div>
      {selectedTables.map((tableKey) => {
        const table = allData[tableKey];
        if (!table) return null;

        const columns =
          table.columns?.map((col: { column_name: string }) => ({
            column_name: col.column_name,
            header: col.column_name.replace(/_/g, " ").toUpperCase(),
            sortable: true,
          })) || [];

        return (
          <div key={tableKey} className="px-4 pb-6">
            <div className="rounded-xl shadow-xs p-4 bg-white">
              {/* ===== HEADER ===== */}
              <div className="flex items-start justify-between mb-4">
                {/* Left */}
                <div>
                  <h2
                    className="text-sm font-semibold flex items-center gap-2"
                    style={{ color: theme.primaryText }}
                  >
                    <GridViewRoundedIcon sx={{ fontSize: "1rem" }} />
                    {table.title}
                  </h2>
                  <p
                    className="text-xs mt-1"
                    style={{ color: theme.secondaryText }}
                  >
                    This displays {table.title.toLowerCase()} details.
                  </p>
                </div>

                {/* Right Controls (HARDCODED) */}
                <div className="flex items-center gap-2">
                  {/* Group By */}
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 border rounded-md text-gray-600 hover:bg-gray-50">
                    Group By
                    <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />
                  </button>

                  {/* Filter */}
                  <button className="flex items-center gap-1 text-xs px-3 py-1.5 border rounded-md text-gray-600 hover:bg-gray-50">
                    Filter
                    <KeyboardArrowDownRoundedIcon sx={{ fontSize: 16 }} />
                  </button>

                  {/* View Toggle */}
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewType("table")}
                      className={`px-2 py-1 ${
                        viewType === "table"
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <TableRowsRoundedIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => setViewType("chart")}
                      className={`px-2 py-1 ${
                        viewType === "chart"
                          ? "bg-gray-100"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <BarChartRoundedIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </div>

              {/* ===== CONTENT ===== */}
              {viewType === "table" ? (
                <ProductDataTable
                  data={table.rows || []}
                  globalFilter={globalFilter}
                  showPagination={true}
                  columns={columns}
                />
              ) : (
                <div className="h-40 flex items-center justify-center text-sm text-gray-400">
                  Chart view (coming soon)
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
