import ChipContainer from "./chip-container";
import AvailableColumnItem from "./available-column-item";

interface ColumnOption {
  id: string;
  label: string;
  checked: boolean;
}

// Column List Component
interface ColumnListProps {
  selectionMode: number;
  selectedColumns: string[];
  availableColumns: string[];
  onRemoveChip: (index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStartFromChip: (index: number) => void;
  onDragStartFromAvailable: (label: string) => void;
}

function ColumnList({
  selectionMode,
  selectedColumns,
  availableColumns,
  onRemoveChip,
  onDrop,
  onDragOver,
  onDragStartFromChip,
  onDragStartFromAvailable
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

      {/* Selected Columns in Drag & Drop Mode */}
      {selectionMode === 1 && (
        <>
          <h3 className="text-xs font-medium text-gray-500 mb-2">
            Selected Column ({selectedColumns.length})
          </h3>
          <ChipContainer 
            items={selectedColumns} 
            onRemoveItem={onRemoveChip}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragStart={onDragStartFromChip}
          />
        </>
      )}

      {/* Available Column */}
      <h3 className="text-xs font-medium text-gray-500 mb-2 mt-6">
        Available Column ({availableColumns.length})
      </h3>

      <div className="space-y-2 mb-6">
        {availableColumns.map((column, index) => (
          <AvailableColumnItem
            key={index}
            label={column}
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', column);
              e.dataTransfer.setData('source', 'available');
              onDragStartFromAvailable(column);
            }}
          />
        ))}
      </div>
    </div>
  );
}


export default ColumnList;
