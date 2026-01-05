import { useEffect, useState } from "react";
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

  selectedGroupBy: string[];
  setSelectedGroupBy: (v: string[]) => void;

  selectedFilters: { column: string; operator: string }[];
  setSelectedFilters: (v: { column: string; operator: string }[]) => void;

  filterValues: Record<string, any>;
  setFilterValues: (v: Record<string, any>) => void;

  aggregations: { column: string; agg: string }[];
  setAggregations: React.Dispatch<
    React.SetStateAction<{ column: string; agg: string }[]>
  >;

  selectedChartColumns: string[];
  setSelectedChartColumns: (v: string[]) => void;

  charts: ChartConfig[];
  setCharts: React.Dispatch<React.SetStateAction<ChartConfig[]>>;
}
export interface ChartConfig {
  id: string;
  type: "line" | "bar" | "pie" | "kpi" | "box" | "mixed" | "bubble" | "waterfall";
  xAxis?: string;
  yAxis?: string | string[];   //  IMPORTANT
  value?: string;
  size?: string;
  label?: string;
  agg?: "count" | "sum";
  rows: any[];
}

const calculateAggregation = (
  rows: any[],
  aggregations: { column: string; agg: string }[]
) => {
  const map: Record<string, Record<string, number>> = {};

  aggregations.forEach(({ column, agg }) => {
    if (!map[column]) map[column] = {};

    switch (agg) {
      case "count":
        map[column]["COUNT"] = rows.length;
        break;

      case "sum":
        map[column]["SUM"] = rows.reduce(
          (a, r) => a + Number(r[column] || 0),
          0
        );
        break;

      case "avg":
        map[column]["AVG"] =
          rows.reduce((a, r) => a + Number(r[column] || 0), 0) /
          (rows.length || 1);
        break;

      case "min":
        map[column]["MIN"] = Math.min(
          ...rows.map(r => Number(r[column] || 0))
        );
        break;

      case "max":
        map[column]["MAX"] = Math.max(
          ...rows.map(r => Number(r[column] || 0))
        );
        break;
    }
  });

  return map;
};

const groupRows = (
  rows: any[],
  groupCols: string[],
  aggregations: { column: string; agg: string }[],
  aggregationOrder: string[]
) => {
  if (!groupCols.length) return rows;

  const map: Record<string, any[]> = {};
  const finalRows: any[] = [];

  rows.forEach(row => {
    const key = groupCols.map(col => row[col]).join(" | ");
    if (!map[key]) map[key] = [];
    map[key].push(row);
  });

  Object.entries(map).forEach(([groupKey, items]) => {
    // 🔹 GROUP HEADER
    // finalRows.push({
    //   __isGroup: true,
    //   __groupKey: groupKey,
    //   __groupLabel: `${groupCols.join(", ").toUpperCase()}: ${groupKey}`,
    //   __count: items.length,
    // });
    const aggMap = calculateAggregation(items, aggregations);

    aggregationOrder.forEach((agg) => {
      finalRows.push({
        __isGroupAggItem: true,
        __parentGroup: groupKey,
        __aggLabel: agg,              // COUNT / SUM / MIN / AVG
        __aggMap: aggMap,             // values
      });

      // 🔥 separator after EACH aggregation
      finalRows.push({
        __isAggSeparator: true,
        __parentGroup: groupKey,
      });
    });
  });

  return finalRows;
};



export default function DataViewTable({
  allData,
  selectedTables,
  globalFilter,

  selectedGroupBy,
  setSelectedGroupBy,

  selectedFilters,
  setSelectedFilters,

  filterValues,
  setFilterValues,

  aggregations,
  setAggregations,

  selectedChartColumns,
  setSelectedChartColumns,

  charts,
  setCharts,

}: DataViewTableProps) {
  const { theme } = useTheme();
  const [viewType, setViewType] = useState<"table" | "chart">("table");
  // const [selectedGroupBy, setSelectedGroupBy] = useState<string[]>([]);
  // const [selectedFilters, setSelectedFilters] = useState<
  //   { column: string; operator: string }[]
  // >([]);
  // const [filterValues, setFilterValues] = useState<Record<string, any>>({});
  const [showChartSidebar, setShowChartSidebar] = useState(false);
  // const [charts, setCharts] = useState<ChartConfig[]>([]);
  const primaryTableKey = selectedTables[0];
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  // const [aggregations, setAggregations] = useState<
  //   { column: string; agg: string }[]
  // >([]);
  // const [selectedChartColumns, setSelectedChartColumns] = useState<string[]>([]);


  useEffect(() => {
    if (!selectedGroupBy.length) return;
    if (!allData || selectedTables.length === 0) return;

    const tableKey = selectedTables[0];
    const table = allData[tableKey];
    if (!table) return;

    const rows = table.rows || [];

    const collapsed: Record<string, boolean> = {};

    rows.forEach(row => {
      const key = selectedGroupBy.map(col => row[col]).join(" | ");
      collapsed[key] = true; // 🔥 DEFAULT COLLAPSED
    });

    setCollapsedGroups(collapsed);
  }, [selectedGroupBy, allData]);
  // useEffect(() => {
  //   if (charts.length > 0) {
  //     setViewType("table");        // table view
  //     setShowChartSidebar(false); // charts below table
  //   }
  // }, [charts]);



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
  const aggregationOrder = Array.from(
    new Set(
      aggregations.map(a => a.agg.toUpperCase())
    )
  );

  const aggregationMap: Record<string, Record<string, number>> = {};

  aggregations.forEach(({ column, agg }) => {
    if (!aggregationMap[column]) {
      aggregationMap[column] = {};
    }

    switch (agg) {
      case "count":
        aggregationMap[column]["COUNT"] = filteredRows.length;
        break;

      case "sum":
        aggregationMap[column]["SUM"] =
          filteredRows.reduce(
            (acc, row) => acc + Number(row[column] || 0),
            0
          );
        break;

      case "avg":
        aggregationMap[column]["AVG"] =
          filteredRows.reduce(
            (acc, row) => acc + Number(row[column] || 0),
            0
          ) / (filteredRows.length || 1);
        break;

      case "min":
        aggregationMap[column]["MIN"] = Math.min(
          ...filteredRows.map(r => Number(r[column] || 0))
        );
        break;

      case "max":
        aggregationMap[column]["MAX"] = Math.max(
          ...filteredRows.map(r => Number(r[column] || 0))
        );
        break;
    }
  });


  const grouped =
    selectedGroupBy.length > 0
      ? groupRows(
        filteredRows,
        selectedGroupBy,
        aggregations,
        aggregationOrder
      )
      : filteredRows;



  const displayRows = grouped.filter(row => {
    if (row.__isGroup || row.__isGroupAgg) return true;
    return !collapsedGroups[row.__parentGroup];
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
    setCharts(prevCharts => {
      const updatedCharts = prevCharts.filter(c => c.id !== id);

      // 🔥 recalc columns still in use
      const stillUsedColumns = getColumnsUsedByCharts(updatedCharts);

      // 🔥 update selected columns accordingly
      setSelectedChartColumns(stillUsedColumns);

      return updatedCharts;
    });
  };


  const toggleGroup = (key: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const removeChartsByColumns = (activeColumns: string[]) => {
    setCharts(prev =>
      prev.filter(chart => {
        const usedColumns = [
          chart.xAxis,
          ...(Array.isArray(chart.yAxis) ? chart.yAxis : [chart.yAxis]),
          chart.value,
          chart.size,
          chart.label
        ].filter(Boolean) as string[];

        return usedColumns.every(col => activeColumns.includes(col));
      })
    );
  };
  const getColumnsUsedByCharts = (charts: ChartConfig[]) => {
    const cols = new Set<string>();

    charts.forEach(chart => {
      if (chart.xAxis) cols.add(chart.xAxis);

      if (Array.isArray(chart.yAxis)) {
        chart.yAxis.forEach(c => cols.add(c));
      } else if (chart.yAxis) {
        cols.add(chart.yAxis);
      }

      if (chart.value) cols.add(chart.value);
      if (chart.size) cols.add(chart.size);
      if (chart.label) cols.add(chart.label);
    });

    return Array.from(cols);
  };

  const isSameChart = (a: ChartConfig, b: Partial<ChartConfig>) => {
    const normalize = (v: any) =>
      Array.isArray(v) ? v.join("|") : v ?? "";

    return (
      a.type === b.type &&
      normalize(a.xAxis) === normalize(b.xAxis) &&
      normalize(a.yAxis) === normalize(b.yAxis) &&
      normalize(a.value) === normalize(b.value) &&
      normalize(a.size) === normalize(b.size) &&
      normalize(a.label) === normalize(b.label)
    );
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


        const chartsWithRows = charts.map(c => ({
          ...c,
          rows: chartRows
        }));


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
                      showClear={false}
                      value={selectedGroupBy}
                      options={groupByColumns.map((col: string) => ({
                        label: col.replace(/_/g, " ").toUpperCase(),
                        value: col,
                      }))}
                      // onChange={(e) => {
                      //   setSelectedGroupBy(e.value);

                      //   const groups = groupRows(
                      //     filteredRows,
                      //     e.value,
                      //     aggregations,
                      //     aggregationOrder
                      //   );

                      //   const collapsed = groups
                      //     .filter(r => r.__isGroup)
                      //     .reduce((acc: any, g: any) => {
                      //       acc[g.__groupKey] = true;
                      //       return acc;
                      //     }, {});

                      //   setCollapsedGroups(collapsed);
                      // }}
                      onChange={(e) => {
                        const newGroups = e.value;
                        setSelectedGroupBy(newGroups);

                        // 🔥 GROUP BY CLEARED
                        if (newGroups.length === 0) {
                          setAggregations([]);          // ✅ clear footer aggregations
                          setCollapsedGroups({});       // ✅ reset group state
                          return;
                        }

                        // 🔹 GROUP BY APPLIED
                        const groups = groupRows(
                          filteredRows,
                          newGroups,
                          aggregations,
                          aggregationOrder
                        );

                        const collapsed = groups
                          .filter(r => r.__isGroup)
                          .reduce((acc: any, g: any) => {
                            acc[g.__groupKey] = true;
                            return acc;
                          }, {});

                        setCollapsedGroups(collapsed);
                      }}


                      placeholder="Group By"
                      display="chip"
                      className="w-64 bg-gray-50 border border-gray-300 rounded-lg text-sm min-h-[40px] flex items-center ps-2"
                      panelClassName="bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                      pt={{
                        filterContainer: {
                          className: "pb-3"   // search নিচে space
                        },
                        list: {
                          className: "mt-4"   // 🔥 search & options gap
                        }
                      }}
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
                      className="w-64 bg-gray-50 border border-gray-300 rounded-lg text-sm min-h-[40px] flex items-center ps-2"
                      panelClassName="bg-gray-50 border border-gray-200 rounded-lg shadow-sm"
                      pt={{
                        filterContainer: {
                          className: "pb-3"   // search নিচে space
                        },
                        list: {
                          className: "mt-4"   // 🔥 search & options gap
                        }
                      }}
                    />
                  )}
                  {/* ===== FILTER INPUTS ===== */}
                  {selectedFilters.length > 0 && (
                    <div className="flex items-center gap-3 flex-wrap">

                      {selectedFilters.map((f) => {
                        const key = `${f.column}|${f.operator}`;
                        const type = getColumnType(table, f.column);

                        const inputBaseClass = `
      h-9
      border border-gray-300
      rounded-md
      px-3
      text-sm
      text-gray-700
      bg-white
      shadow-sm
      transition-all duration-200
      focus:outline-none
      focus:ring-2 focus:ring-blue-500/30
      focus:border-blue-500
      hover:border-gray-400
    `;

                        return (
                          <div
                            key={key}
                            className="
          flex items-center gap-2
          bg-gray-50
          border border-gray-200
          rounded-lg
          px-3 py-1.5
          shadow-sm
          hover:shadow-md
          transition
        "
                          >
                            {/* Label */}
                            <span className="text-xs font-semibold text-gray-600 whitespace-nowrap">
                              {f.column.replace(/_/g, " ").toUpperCase()}
                              <span className="mx-1 text-gray-400">{f.operator}</span>
                            </span>

                            {/* TEXT */}
                            {type === "text" && (
                              <input
                                type="text"
                                placeholder="Enter value"
                                className={`${inputBaseClass} w-40`}
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
                                className={`${inputBaseClass} w-28`}
                                value={filterValues[key] ?? ""}
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
                                className={`${inputBaseClass} w-[150px]`}
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
                  <div className="flex border rounded-lg overflow-hidden">
                    <button
                      onClick={() => {
                        setViewType("table");
                        setShowChartSidebar(false); // ✅ ADD THIS
                      }}
                      className={`px-2 py-2 ${viewType === "table"
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
              {/* 🔥 CHARTS ABOVE TABLE WHEN SIDEBAR OPEN */}
              {showChartSidebar && charts.length > 0 && (
                <div className="mb-6">
                  <RenderCharts
                    charts={chartsWithRows}

                    onRemoveChart={removeChart}
                    onReorderCharts={setCharts}
                  />
                </div>
              )}

              {/* {viewType === "table" && */}
              {!(showChartSidebar && charts.length > 0) && (

                <ProductDataTable
                  data={displayRows}
                  globalFilter={globalFilter}
                  showPagination={true}
                  columns={columns}
                  columnAggregations={table.visualization?.aggregations}
                  aggregationMap={aggregationMap}
                  aggregationOrder={aggregationOrder}
                  isGrouped={selectedGroupBy.length > 0}           // 🔥 NEW
                  onAggregationSelect={(column, agg) => {
                    setAggregations(prev => {
                      const exists = prev.find(
                        a => a.column === column && a.agg === agg
                      );

                      // already selected → ignore
                      if (exists) return prev;

                      // allow multiple aggregation for same column
                      return [...prev, { column, agg }];
                    });
                  }}

                  enableRowGrouping={selectedGroupBy.length > 0}
                  collapsedGroups={collapsedGroups}        // ✅ NEW
                  onToggleGroup={toggleGroup}
                />
              )}
              {/* } */}
              {showChartSidebar && (
                <ChartSidebar
                  columns={chartColumns}
                  rows={chartRows}
                  columnTypes={chartColumnTypes}
                  selectedColumns={selectedChartColumns}
                  onSelectedColumnsChange={(cols) => {
                    setSelectedChartColumns(cols);   // ✅ persist
                    removeChartsByColumns(cols);     // ✅ auto-delete charts
                  }}
                  // onChartSelect={(config) => {
                  //   setCharts(prev => [
                  //     ...prev,
                  //     { ...config, id: Date.now().toString() }
                  //   ]);
                  // }}
                  onChartSelect={(config) => {
                    setCharts(prev => {
                      const exists = prev.some(chart => isSameChart(chart, config));

                      if (exists) {
                        return prev; // 🚫 already exists
                      }

                      return [
                        ...prev,
                        { ...config, id: Date.now().toString() }
                      ];
                    });
                  }}

                  onClose={() => setShowChartSidebar(false)}
                />
              )}

              {!showChartSidebar && charts.length > 0 && (
                <div className="mt-6">
                  <RenderCharts
                    charts={chartsWithRows}
                    onRemoveChart={removeChart}
                    onReorderCharts={setCharts}
                  />
                </div>
              )}


            </div>
          </div>
        );
      })}
    </div>
  );
}
