interface AvailableColumnItemProps {
  label: string;
  onDragStart: (e: React.DragEvent) => void;
}

export default function AvailableColumnItem({ 
  label, 
  onDragStart 
}: {
  label: string;
  onDragStart: (e: React.DragEvent) => void;
}) {
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


