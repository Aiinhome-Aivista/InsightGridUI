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

import { useState, useEffect } from "react";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import { useTheme } from "../../../theme";
import ProductDataTable from "../../query-designer/components/DataTable";
import { MultiSelect } from "primereact/multiselect";
import { Accordion, AccordionTab } from "primereact/accordion";

interface DataViewTableProps {
  allData: { [key: string]: any };
  selectedTables: string[];
  globalFilter: string;
  onAggregationSelect?: (column: string, agg: string) => void;

}
const groupRows = (rows: any[], groupCols: string[]) => {
  if (!groupCols.length) return rows;

  const map: Record<string, any[]> = {};

  rows.forEach(row => {
    const key = groupCols.map(col => row[col]).join(" | ");

    if (!map[key]) {
      map[key] = [];
    }
    map[key].push(row);
  });

  return Object.entries(map).map(([groupKey, items]) => ({
    __groupKey: groupKey,
    __rows: items,
  }));
};


export default function DataViewTable({
  allData,
  selectedTables,
  globalFilter,
  onAggregationSelect,
}: DataViewTableProps) {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<"table" | "chart">("table");
  const [selectedGroupBy, setSelectedGroupBy] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    { column: string; operator: string }[]
  >([]);
  const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [activeGroupKey, setActiveGroupKey] = useState<string | null>(null);
  const primaryTableKey = selectedTables[0];
  const applyFilters = (rows: any[]) => {
    if (!selectedFilters.length) return rows;

    return rows.filter((row) => {
      return selectedFilters.every((f) => {
        const key = `${f.column}|${f.operator}`;
        const value = filterValues[key];
        const cell = row[f.column];

        if (value === undefined || value === "" || value === null) return true;

        // TEXT filters
        if (["equals", "like", "in"].includes(f.operator)) {
          const cellStr = String(cell ?? "").toLowerCase();
          const valStr = String(value).toLowerCase();

          if (f.operator === "equals") return cellStr === valStr;
          if (f.operator === "like") return cellStr.includes(valStr);
          if (f.operator === "in")
            return valStr.split(",").map(v => v.trim()).includes(cellStr);
        }

        // NUMBER filters
        if (["=", ">", "<"].includes(f.operator)) {
          if (f.operator === "=") return Number(cell) === Number(value);
          if (f.operator === ">") return Number(cell) > Number(value);
          if (f.operator === "<") return Number(cell) < Number(value);
        }

        if (f.operator === "between" && typeof value === "object") {
          const { from, to } = value;
          if (from != null && to != null) {
            return Number(cell) >= Number(from) && Number(cell) <= Number(to);
          }
        }

        // DATE filters
        if (["before", "after"].includes(f.operator)) {
          const cellDate = new Date(cell).getTime();
          const valDate = new Date(value).getTime();

          if (f.operator === "before") return cellDate < valDate;
          if (f.operator === "after") return cellDate > valDate;
        }

        if (f.operator === "between" && typeof value === "object") {
          const from = new Date(value.from).getTime();
          const to = new Date(value.to).getTime();
          const cellDate = new Date(cell).getTime();
          return cellDate >= from && cellDate <= to;
        }

        return true;
      });
    });
  };
  const baseRows =
    primaryTableKey && allData[primaryTableKey]
      ? allData[primaryTableKey].rows || []
      : [];
  const filteredRows = applyFilters(baseRows);

  // const groupedData =
  //   selectedGroupBy.length > 0
  //     ? groupRows(baseRows, selectedGroupBy)
  //     : [];
  const groupedData =
    selectedGroupBy.length > 0
      ? groupRows(filteredRows, selectedGroupBy)
      : [];

  useEffect(() => {
    if (groupedData.length > 0) {
      setActiveGroupKey(groupedData[0].__groupKey);
    } else {
      setActiveGroupKey(null);
    }
  }, [selectedGroupBy.join("|")]);

  const getColumnType = (table: any, column: string) => {
    const type = table?.visualization?.column_types?.[column];

    if (!type) return "text";

    if (type === "varchar") return "text";
    if (type === "int" || type === "decimal") return "number";
    if (type === "datetime") return "date";

    return "text";
  };




  return (
    <div>
      {selectedTables.map((tableKey) => {
        const table = allData[tableKey];
        if (!table) return null;

        const columns =
          table.columns?.map((col: { column_name: string }) => ({
            column_name: col.column_name,
            header: col.column_name.replace(/_/g, " ").toUpperCase(),
            sortable: false,
          })) || [];
        const groupByColumns = table.visualization?.group_by || [];
        const filters = table.visualization?.filters || {};



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
                <div className="flex items-center gap-3 flex-wrap">
                  {groupByColumns.length > 0 && (
                    <MultiSelect
                      filter
                      value={selectedGroupBy}
                      options={groupByColumns.map((col: string) => ({
                        label: col.replace(/_/g, " ").toUpperCase(),
                        value: col,
                      }))}
                      onChange={(e) => {
                        setSelectedGroupBy(e.value);
                        console.log("GROUP BY:", e.value);

                        // 🔥 future:
                        // onGroupBySelect?.(e.value)
                      }}
                      placeholder="Group By"
                      display="chip"
                      className="w-64 bg-gray-50 border border-gray-300 rounded-lg text-sm min-h-[40px] flex items-center"
                      panelClassName="bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                    />
                  )}


                  {Object.keys(filters).length > 0 && (
                    <MultiSelect
                      filter
                      value={selectedFilters.map(f => `${f.column}|${f.operator}`)}
                      options={Object.entries(filters).flatMap(([col, ops]) =>
                        (ops as string[]).map((op) => ({
                          label: `${col.toUpperCase()} ${op}`,
                          value: `${col}|${op}`,
                        }))
                      )}
                      onChange={(e) => {
                        const parsed = e.value.map((v: string) => {
                          const [column, operator] = v.split("|");
                          return { column, operator };
                        });

                        setSelectedFilters(parsed);
                        console.log("FILTERS:", parsed);

                        // 🔥 future:
                        // open value input modal
                      }}
                      placeholder="Filter"
                      display="chip"
                      className="w-64 bg-gray-50 border border-gray-300 rounded-lg text-sm min-h-[40px] flex items-center"
                      panelClassName="bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                    />
                  )}
                  {/* ===== FILTER INPUTS ===== */}
                  {selectedFilters.length > 0 && (
                    <div className="flex items-center gap-3">
                      {selectedFilters.map((f) => {
                        const key = `${f.column}|${f.operator}`;
                        const type = getColumnType(table, f.column);

                        return (
                          <div
                            key={key}
                            className="flex items-center gap-2 bg-gray-50 border rounded-lg px-3 py-1 h-[40px]"
                          >
                            <span className="text-xs text-gray-600 whitespace-nowrap">
                              {f.column.toUpperCase()} {f.operator}
                            </span>

                            {/* TEXT */}
                            {type === "text" && (
                              <input
                                type="text"
                                className="border rounded px-2 py-1 text-sm w-40"
                                placeholder="Enter value"
                                value={filterValues[key] || ""}
                                onChange={(e) =>
                                  setFilterValues({
                                    ...filterValues,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            )}

                            {/* NUMBER */}
                            {type === "number" && f.operator !== "between" && (
                              <input
                                type="number"
                                className="border rounded px-2 py-1 text-sm w-28"
                                value={filterValues[key] || ""}
                                onChange={(e) =>
                                  setFilterValues({
                                    ...filterValues,
                                    [key]: Number(e.target.value),
                                  })
                                }
                              />
                            )}

                            {/* DATE */}
                            {type === "date" && f.operator !== "between" && (
                              <input
                                type="date"
                                className="border rounded px-2 py-1 text-sm w-[150px]"
                                value={filterValues[key] || ""}
                                onChange={(e) =>
                                  setFilterValues({
                                    ...filterValues,
                                    [key]: e.target.value,
                                  })
                                }
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}



                  {/* View Toggle */}
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={() => setViewType("table")}
                      className={`px-2 py-1 ${viewType === "table"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <TableRowsRoundedIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => setViewType("chart")}
                      className={`px-2 py-1 ${viewType === "chart"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <BarChartRoundedIcon sx={{ fontSize: 18 }} />
                    </button>
                  </div>
                </div>
              </div>
              {viewType === "table" ? (
                selectedGroupBy.length > 0 ? (
                  <Accordion activeIndex={0} className="w-full">
                    {groupedData.map((group: any, idx: number) => (
                      <AccordionTab
                        key={group.__groupKey}
                        header={
                          <div className="flex justify-between items-center w-full">
                            <span className="font-semibold">
                              {group.__groupKey}
                            </span>
                            <span className="text-xs text-gray-500">
                              {group.__rows.length} rows
                            </span>
                          </div>
                        }
                      >
                        {/* Scrollable table container */}
                        <div className="max-h-[420px] overflow-y-auto border rounded-lg">
                          <ProductDataTable
                            data={group.__rows}
                            globalFilter={globalFilter}
                            showPagination={true}
                            columns={columns}
                            columnAggregations={table.visualization?.aggregations}
                            onAggregationSelect={onAggregationSelect}
                          />
                        </div>
                      </AccordionTab>
                    ))}
                  </Accordion>
                ) : (
                  <ProductDataTable
                    data={filteredRows}
                    globalFilter={globalFilter}
                    showPagination={true}
                    columns={columns}
                    columnAggregations={table.visualization?.aggregations}
                    onAggregationSelect={onAggregationSelect}
                  />
                )
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
