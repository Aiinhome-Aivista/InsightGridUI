import CloseIcon from "@mui/icons-material/Close";

interface ChipsetProps {
  label: string;
  onRemove: () => void;
}

function Chipset({ label, onRemove }: ChipsetProps) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-full">
      <span className="text-sm text-gray-700">{label}</span>
      <button
        onClick={onRemove}
        className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-400 hover:bg-gray-500 transition-colors"
      >
        <CloseIcon sx={{ fontSize: 14, color: 'white' }} />
      </button>
    </div>
  );
}

export default Chipset;
