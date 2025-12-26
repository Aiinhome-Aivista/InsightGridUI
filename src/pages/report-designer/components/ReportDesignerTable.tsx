import { useState } from "react";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import BarChartRoundedIcon from "@mui/icons-material/BarChartRounded";
import { useTheme } from "../../../theme";
import ProductDataTable from "../../query-designer/components/DataTable";
import { MultiSelect } from "primereact/multiselect";
import ChartSidebar from "./ChartSidebar";
import RenderCharts from "./render-charts";


interface DataViewTableProps {
  allData: { [key: string]: any };
  selectedTables: string[];
  globalFilter: string;
  onAggregationSelect?: (column: string, agg: string) => void;

}
export interface ChartConfig {
  id: string;
  type: "bar" | "pie" | "kpi" | "box" | "mixed" | "bubble" | "waterfall";
  xAxis?: string;
  yAxis?: string | string[];   // ✅ IMPORTANT
  value?: string;
  size?: string;
  label?: string;
  agg?: "count" | "sum";
  rows: any[];
}



// const groupRows = (rows: any[], groupCols: string[]) => {
//   if (!groupCols.length) return rows;

//   const result: any[] = [];
//   const map: Record<string, any[]> = {};

//   rows.forEach(row => {
//     const key = groupCols.map(col => row[col]).join(" | ");
//     if (!map[key]) map[key] = [];
//     map[key].push(row);
//   });

//   Object.entries(map).forEach(([groupKey, items]) => {
//     result.push({
//       __isGroup: true,
//       __groupLabel: `${groupCols.join(", ").toUpperCase()}: ${groupKey}`,
//       __count: items.length,
//     });

//     items.forEach(item => result.push(item));
//   });

//   return result;
// };

const groupRows = (rows: any[], groupCols: string[]) => {
  if (!groupCols.length) return rows;

  const result: any[] = [];
  const map: Record<string, any[]> = {};

  rows.forEach(row => {
    const key = groupCols.map(col => row[col]).join(" | ");
    if (!map[key]) map[key] = [];
    map[key].push(row);
  });

  Object.entries(map).forEach(([groupKey, items]) => {
    result.push({
      __isGroup: true,
      __groupKey: groupKey,
      __groupLabel: `${groupCols.join(", ").toUpperCase()}: ${groupKey}`,
      __count: items.length,
      __collapsed: true   // ✅ default collapsed
    });

    items.forEach(item =>
      result.push({
        ...item,
        __parentGroup: groupKey
      })
    );
  });

  return result;
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
  const [showChartSidebar, setShowChartSidebar] = useState(false);
  const [charts, setCharts] = useState<ChartConfig[]>([]);
  const primaryTableKey = selectedTables[0];
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

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
  // const displayRows =
  //   selectedGroupBy.length > 0
  //     ? groupRows(filteredRows, selectedGroupBy)
  //     : filteredRows;
  const grouped = selectedGroupBy.length > 0
    ? groupRows(filteredRows, selectedGroupBy)
    : filteredRows;

  const displayRows = grouped.filter(row => {
    if (!row.__parentGroup) return true; // group row
    return !collapsedGroups[row.__parentGroup]; // hide children if collapsed
  });

  // 🔥 Charts should NEVER use grouped rows
  const chartRows = filteredRows;


  const getColumnType = (table: any, column: string) => {
    const type = table?.visualization?.column_types?.[column];

    if (!type) return "text";

    if (type === "varchar") return "text";
    if (type === "int" || type === "decimal") return "number";
    if (type === "datetime") return "date";

    return "text";
  };

  const removeChart = (id: string) => {
    setCharts(prev => prev.filter(c => c.id !== id));
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
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
        const chartColumns =
          table.columns?.map((col: { column_name: string }) => ({
            column_name: col.column_name,                  // ✅ SAME KEY
            label: col.column_name.replace(/_/g, " ").toUpperCase(),
          })) || [];

        const chartColumnTypes =
          table.visualization?.column_types || {};




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

                        // 🔥 initialize all groups as collapsed
                        const groups = groupRows(filteredRows, e.value)
                          .filter(r => r.__isGroup)
                          .reduce((acc: any, g: any) => {
                            acc[g.__groupKey] = true;
                            return acc;
                          }, {});

                        setCollapsedGroups(groups);
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
                      onClick={() => {
                        setViewType("table");
                        setShowChartSidebar(false); // ✅ ADD THIS
                      }}
                      className={`px-2 py-1 ${viewType === "table"
                        ? "bg-gray-100"
                        : "hover:bg-gray-50"
                        }`}
                    >
                      <TableRowsRoundedIcon sx={{ fontSize: 18 }} />
                    </button>
                    <button
                      onClick={() => {
                        setViewType("chart");
                        setShowChartSidebar(true);
                      }}
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
              {viewType === "table" &&

                <ProductDataTable
                  data={displayRows}
                  globalFilter={globalFilter}
                  showPagination={true}
                  columns={columns}
                  columnAggregations={table.visualization?.aggregations}
                  onAggregationSelect={onAggregationSelect}
                  enableRowGrouping={selectedGroupBy.length > 0}
                  collapsedGroups={collapsedGroups}        // ✅ NEW
                  onToggleGroup={toggleGroup}
                />
              }

              {showChartSidebar && (
                <ChartSidebar
                  columns={chartColumns}                // ✅ clean columns
                  rows={chartRows}
                  columnTypes={chartColumnTypes}        // ✅ exact map
                  onChartSelect={(config) => {
                    setCharts(prev => [
                      ...prev,
                      {
                        ...config,
                        id: Date.now().toString()
                      }
                    ]);
                    setViewType("chart");
                  }}

                  onClose={() => {
                    setShowChartSidebar(false);
                    setViewType("table");
                  }}
                />
              )}


              {viewType === "chart" && (
                <RenderCharts
                  charts={charts}
                  onRemoveChart={removeChart}
                />
              )}



            </div>
          </div>
        );
      })}
    </div>
  );
}
