import { useState } from "react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

export default function ColumnHeaderWithAggregation({
    label,
    columnName,
    aggregations = [],
    onAggregationSelect,
}: {
    label: string;
    columnName: string;
    aggregations: string[];
    onAggregationSelect?: (column: string, agg: string) => void;

}) {
    const [open, setOpen] = useState(false);

    if (!aggregations.length) {
        return <span>{label}</span>;
    }

    return (
        <div className="relative flex items-center gap-1">
            <span>{label}</span>

            <KeyboardArrowDownRoundedIcon
                sx={{ fontSize: 20, cursor: "pointer" }}
                onClick={() => setOpen(!open)}
            />

            {open && (
                <div className="absolute top-full left-0 z-50 bg-white border rounded shadow-md text-xs min-w-[120px]">
                    {aggregations.map((agg) => (
                        <div
                            key={agg}
                            className="px-3 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => {
                                onAggregationSelect?.(columnName, agg);
                                setOpen(false);
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
