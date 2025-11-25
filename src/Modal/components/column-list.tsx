import ChipContainer from "./chip-container";

interface ColumnOption {
  id: string;
  label: string;
  checked: boolean;
}

// Column List Component
interface ColumnListProps {
  selectionMode: number;
  columns: ColumnOption[];
  onToggleColumn: (id: string) => void;
  selectedChips: string[];
  onRemoveChip: (index: number) => void;
}

function ColumnList({
  selectionMode,
  columns,
  onToggleColumn,
  selectedChips,
  onRemoveChip
}: ColumnListProps) {
  return (
    <div className="w-full">
      {/* Default Column */}
      <h3 className="text-xs font-medium text-gray-500 mb-2">
        Default Column (3)
      </h3>

      <div className="space-y-2 text-sm mb-6">
        <p className="text-gray-700">Sales</p>
        <p className="text-gray-700">Product</p>
        <p className="text-gray-700">Customer</p>
      </div>

      {/* Add Column */}
      <h3 className="text-xs font-medium text-gray-500 mb-2">
        Add Column ({columns.length})
      </h3>

      {selectionMode === 0 ? (
        // Multi Select Mode
        <div className="space-y-3 text-sm">
          {columns.map((column) => (
            <label key={column.id} className="flex items-center">
              <input
                type="checkbox"
                checked={column.checked}
                onChange={() => onToggleColumn(column.id)}
                className="w-4 h-4 mr-3"
              />
              {column.label}
            </label>
          ))}
        </div>
      ) : (
        // Drag & Drop Mode - Show Chip Container
        <ChipContainer items={selectedChips} onRemoveItem={onRemoveChip} />
      )}

      {/* Default Column */}
      <h3 className="text-xs font-medium text-gray-500 mb-2 mt-6">
        Available Column (3)
      </h3>

      <div className="space-y-2 text-sm mb-6">
        <p className="text-gray-700">Product Value</p>
        <p className="text-gray-700">Purchase Amount</p>
        <p className="text-gray-700">Credit Point</p>
      </div>
    </div>
  );
}

export default ColumnList;
