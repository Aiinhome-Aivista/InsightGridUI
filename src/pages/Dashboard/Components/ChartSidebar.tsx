import CloseIcon from '@mui/icons-material/Close';

interface ChartSidebarProps {
  onClose: () => void;
}

export default function ChartSidebar({ onClose }: ChartSidebarProps) {
  return (
    <div className="fixed top-0 right-0 w-80 bg-white shadow-lg p-4 h-screen border-l">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Chart View</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 transition">
          <CloseIcon sx={{ fontSize: "1.2rem" }} />
        </button>
      </div>
      <p className="text-gray-600">Chart content will be displayed here.</p>
    </div>
  );
}