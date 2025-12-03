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
  globalFilter: string;
}

export default function DashboardTable({ data, globalFilter }: DashboardTableProps) {
  const { theme } = useTheme();
  const [toggleSelection, setToggleSelection] = useState(1);
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="p-6">
      <div className="rounded-xl shadow-xs p-4" >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold flex items-center gap-2" style={{ color: theme.primaryText }}>
              <GridViewRoundedIcon sx={{ fontSize: "1rem", color: theme.primaryText }} />
              Product Details
            </h2>
            <p className="text-xs mt-1" style={{ color: theme.secondaryText }}>
              This table is showing all product details
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle */}
            <AnimatedToggleButton
              options={[
                  { label: "Meta Data", value: 'metadata' },
                  { label: "Data View", value: 'dataview' },
                  { label: "Insight", value: 'insights' },
             
              ]}
              defaultSelected={toggleSelection}
              onChange={(i) => {
                setToggleSelection(i);
              }}
              mode="text"
            />
            <IconButton onClick={() => setIsExpanded(!isExpanded)} size="small">
              {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </div>
        </div>

        {/* CONDITIONAL RENDER */}
        {isExpanded && (
          <>
            {toggleSelection === 0 && (
              <div className="p-4 min-h-[200px] flex items-center justify-center">
                <div className="flex flex-wrap gap-3">
                  {['Product ID', 'Category', 'Brand', 'Price', 'Stock'].map(pill => (
                    <span key={pill} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-full text-sm">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {toggleSelection === 1 && (
              <ProductDataTable data={data} globalFilter={globalFilter} />
            )}
            {toggleSelection === 2 && (
              <div className="p-4 min-h-[200px] flex items-center justify-center text-gray-500">Under development</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
