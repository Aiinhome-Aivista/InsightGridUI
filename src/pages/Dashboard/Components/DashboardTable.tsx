import { useState } from "react";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useTheme } from "../../../theme";
import AnimatedToggleButton from "../../../Modal/components/animated-toggle-button";
import ProductDataTable from "../Components/DataTable";
import { IconButton } from "@mui/material";
interface DashboardTableProps {
  data: any[];
  columns: { column_name: string }[];
  insights: string[];
  globalFilter: string;
  tableName: string;
  viewSelection: string;
}

export default function DashboardTable({ data, columns, insights, globalFilter, tableName, viewSelection }: DashboardTableProps) {
  const { theme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="p-1">
      <div className="rounded-xl shadow-xs p-4" >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-md font-semibold flex items-center gap-2" style={{ color: theme.primaryText }}>
              <GridViewRoundedIcon sx={{ fontSize: "1rem", color: theme.primaryText }} />
              {tableName} Details
            </h2>
            <p className="text-xs mt-1" style={{ color: theme.secondaryText }}>
              This table is showing all {tableName} details
            </p>
          </div>

          {/* <div className="flex items-center gap-2">
            <AnimatedToggleButton
              options={[
                  { label: "Meta Data", value: 'metadata' },
                  { label: "Data View", value: 'dataview' },
                  { label: "Insight", value: 'insights' },
             
              ]}
              defaultSelected={defaultSelectionIndex}
              onChange={(_index, value) => {
                setToggleSelection(value as string);
              }}
              mode="text"
            />
            <IconButton onClick={() => setIsExpanded(!isExpanded)} size="small">
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div> */}
        </div>

        {/* CONDITIONAL RENDER */}
        {isExpanded && (
          <>
            {viewSelection === 'metadata' && (
              <div className="p-4 min-h-[200px]  max-h-[300px]flex items-center justify-center">
                <div className="flex flex-wrap gap-3">
                  {columns.map(col => (
                    <span key={col.column_name} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {col.column_name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {viewSelection === 'dataview' && (
              <ProductDataTable data={data} globalFilter={globalFilter} columns={columns} />
            )}
            {viewSelection === 'insights' && (
              <div className="p-4 min-h-[200px] max-h-[200px] overflow-y-auto">
                <ul className="list-disc list-inside space-y-2">
                  {insights.map((insight, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
