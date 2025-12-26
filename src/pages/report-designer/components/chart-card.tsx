
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// ==================== TYPES ====================
interface ChartCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onRemove?: () => void;
}

// ==================== GLOBAL REUSABLE CHART CARD ====================
export default function ChartCard({ title, description, children, onRemove }: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 w-full max-w-md max-h-[350px] flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
        <div className="flex gap-2">
          {onRemove && (
            <button
              onClick={onRemove}
              className="p-1.5 rounded-md hover:bg-red-50 transition"
              title="Remove chart"
            >
              <DeleteOutlineIcon
                sx={{ fontSize: "1.5rem" }}
                className="text-red-500 hover:text-red-600"
              />
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}