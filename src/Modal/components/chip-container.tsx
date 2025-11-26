import Chipset from "./chipset";

export default function ChipContainer({ 
  items, 
  onRemoveItem, 
  onDrop, 
  onDragOver, 
  onDragStart 
}: {
  items: string[];
  onRemoveItem: (index: number) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (index: number) => void;
}) {
  return (
    <div 
      onDrop={onDrop}
      onDragOver={onDragOver}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50 w-full hover:border-gray-400 transition-colors"
    >
      {items.length === 0 ? (
        <p className="text-gray-400 text-sm text-center py-8">
          Drag and drop columns here
        </p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {items.map((item, index) => (
            <Chipset
              key={index}
              label={item}
              onRemove={() => onRemoveItem(index)}
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', item);
                e.dataTransfer.setData('source', 'chip');
                onDragStart(index);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

