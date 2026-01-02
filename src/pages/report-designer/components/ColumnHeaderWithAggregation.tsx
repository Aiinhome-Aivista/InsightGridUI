import { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

export default function ColumnHeaderWithAggregation({
    label,
    columnName,
    aggregations = [],
    onAggregationSelect,
    openAggColumn,
    setOpenAggColumn
}: {
    label: string;
    columnName: string;
    aggregations: string[];
    onAggregationSelect?: (column: string, agg: string) => void;
    openAggColumn: string | null;
    setOpenAggColumn: (col: string | null) => void;
}) {

    const isOpen = openAggColumn === columnName;

    if (!aggregations.length) {
        return <span>{label}</span>;
    }

    return (
        <div className="relative flex items-center gap-1">
            <span>{label}</span>

            <KeyboardArrowDownRoundedIcon
                sx={{ fontSize: 25, cursor: "pointer" }}
                onClick={() =>
                    setOpenAggColumn(isOpen ? null : columnName)
                }
            />

            {isOpen && (
                <div className="absolute top-full left-0 z-50 bg-white border rounded shadow-md text-xs min-w-[120px]">
                    {aggregations.map((agg) => (
                        <div
                            key={agg}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onAggregationSelect?.(columnName, agg);
                                setOpenAggColumn(null);
                            }}

                        >
                            {agg.toUpperCase()}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
