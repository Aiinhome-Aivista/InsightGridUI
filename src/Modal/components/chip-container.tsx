import Chipset from "./chipset";

interface ChipContainerProps {
  items: string[];
  onRemoveItem: (index: number) => void;
}

function ChipContainer({ items, onRemoveItem }: ChipContainerProps) {
  if (items.length === 0) return null;

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[200px] bg-gray-50 w-full">
      <div className="flex flex-wrap gap-3">
        {items.map((item, index) => (
          <Chipset
            key={index}
            label={item}
            onRemove={() => onRemoveItem(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default ChipContainer;
