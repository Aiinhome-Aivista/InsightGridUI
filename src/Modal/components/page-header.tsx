import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import SearchIcon from '@mui/icons-material/Search';
import AnimatedToggleButton from './animated-toggle-button';

interface PageHeaderProps {
  onClose: () => void;
  selectionMode: number;
  onModeChange: (index: number) => void;
}

function PageHeader({ onClose, selectionMode, onModeChange }: PageHeaderProps) {
  return (
    <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
      <button
        onClick={onClose}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200"
      >
        <KeyboardBackspaceIcon />
      </button>

      <h1 className="text-sm flex-1 py-2 font-medium text-gray-800">Column Selection</h1>

      <input
        type="text"
        placeholder="Name the Collection"
        className="ml-6 flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
      />

      <div className="relative w-80">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" sx={{ fontSize: 20 }} />
        <input
          type="text"
          placeholder="Search Column"
          className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
        />
      </div>

      <AnimatedToggleButton
        options={['Multi Select', 'Drag & Drop']}
        defaultSelected={selectionMode}
        onChange={onModeChange}
      />
    </div>
  );
}

export default PageHeader;