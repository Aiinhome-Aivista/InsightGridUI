import ChipContainer from "./chip-container";
import AvailableColumnItem from "./available-column-item";
import CheckBox from "./check-box"; 

export default function ColumnList({
  selectionMode,
  addColumns,
  availableColumns,
  onRemoveChip,
  onDrop,
  onDragOver,
  onDragStartFromChip,
  onDragStartFromAvailable,
  onToggleCheckbox
}: {
  selectionMode: number;
  addColumns: { label: string; checked: boolean }[];
  availableColumns: string[];
  onRemoveChip: (index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStartFromChip: (index: number) => void;
  onDragStartFromAvailable: (label: string) => void;
  onToggleCheckbox: (label: string) => void;
}) {
  const checkedCount = addColumns.filter(col => col.checked).length;

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

      {/* Add Column Section */}
      <h3 className="text-xs font-medium text-gray-500 mb-2">
        Add Column ({selectionMode === 0 ? checkedCount : addColumns.filter(col => col.checked).length})
      </h3>

      {/* Multi Select Mode - Show Checkboxes */}
      {selectionMode === 0 && (
        <div className="space-y-1 mb-6">
          {addColumns.map((column, index) => (
            <CheckBox
              key={index}
              label={column.label}
              checked={column.checked}
              onChange={() => onToggleCheckbox(column.label)}
            />
          ))}
        </div>
      )}

      {/* Drag & Drop Mode - Show Chip Container */}
      {selectionMode === 1 && (
        <>
          <ChipContainer 
            items={addColumns.filter(col => col.checked).map(col => col.label)}
            onRemoveItem={onRemoveChip}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragStart={onDragStartFromChip}
          />

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
        </>
      )}
    </div>
  );
}



