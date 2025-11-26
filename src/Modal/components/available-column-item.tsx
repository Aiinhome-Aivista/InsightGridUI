interface AvailableColumnItemProps {
  label: string;
  onDragStart: (e: React.DragEvent) => void;
}

function AvailableColumnItem({ label, onDragStart }: AvailableColumnItemProps) {
  return (
    <p
      draggable
      onDragStart={onDragStart}
      className="text-sm text-gray-700 cursor-move hover:text-gray-900 transition-colors"
    >
      {label}
    </p>
  );
}

export default AvailableColumnItem;
