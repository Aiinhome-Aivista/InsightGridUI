import CloseIcon from "@mui/icons-material/Close";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

interface ColumnSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ColumnSelectionModal({ open, onClose }: ColumnSelectionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
     <div className="w-full h-full flex justify-center items-center bg-gray-300">
  <div className="w-[85%] h-[75%] bg-[#d9d9d9] rounded-2xl shadow-md flex flex-col justify-center items-center">

    {/* View Name Section */}
    <p className="text-gray-600 text-lg mb-1">View Name</p>
    <h2 className="text-2xl font-semibold text-gray-700 mb-10">
      Product Details
    </h2>

    {/* Confirmation Text */}
    <p className="text-gray-600 text-xl mb-12">
      Are your confirm you want save the view?
    </p>

    {/* Buttons */}
    <div className="flex gap-4">
      <button
        onClick={onClose}
        className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 bg-white hover:bg-[#4017c9] transition text-sm"
      >
        Cancel
      </button>

      <button
        className="px-6 py-2 rounded-lg bg-[#4B1AE7] text-white hover:bg-[#4017c9] transition text-sm"
      >
        Confirm
      </button>
    </div>

  </div>
</div>

    </div>
  );
}
