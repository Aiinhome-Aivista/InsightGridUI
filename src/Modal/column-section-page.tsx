import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useState } from 'react';
import Sidebar from './components/sidebar';
import PageHeader from './components/page-header';
import ColumnList from './components/column-list';
import PageFooter from './components/page-footer';

interface ColumnSelectionPageProps {
  open: boolean;
  onClose: () => void;
}

interface ColumnOption {
  id: string;
  label: string;
  checked: boolean;
}

export default function ColumnSelectionPage({ open, onClose }: ColumnSelectionPageProps) {
  const [selectionMode, setSelectionMode] = useState(0);
  const [columns, setColumns] = useState<ColumnOption[]>([
    { id: '1', label: 'Category', checked: true },
    { id: '2', label: 'Region', checked: true },
    { id: '3', label: 'Product Value', checked: false },
    { id: '4', label: 'Purchase Amount', checked: false },
    { id: '5', label: 'Credit Point', checked: true },
  ]);
  const [selectedChips, setSelectedChips] = useState<string[]>([
    'Category',
    'Region',
    'Credit Point'
  ]);

  const handleToggleColumn = (id: string) => {
    setColumns(columns.map(col =>
      col.id === id ? { ...col, checked: !col.checked } : col
    ));
  };

  const handleRemoveChip = (index: number) => {
    setSelectedChips(selectedChips.filter((_, i) => i !== index));
  };

  const handleModeChange = (index: number) => {
    setSelectionMode(index);
    console.log('Mode:', index === 0 ? 'Multi Select' : 'Drag & Drop');
  };

  const handleSave = () => {
    console.log('Saving...', { selectionMode, columns, selectedChips });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Content Area - 80% width with Header */}
        <div className="w-4/5 flex flex-col">
          {/* Header */}
          <PageHeader
            onClose={onClose}
            selectionMode={selectionMode}
            onModeChange={handleModeChange}
          />
          {/* Column List */}
          <div className="flex-1 px-10 py-8 overflow-auto">
            <ColumnList
              selectionMode={selectionMode}
              columns={columns}
              onToggleColumn={handleToggleColumn}
              selectedChips={selectedChips}
              onRemoveChip={handleRemoveChip}
            />
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="w-px bg-gray-200"></div>
        {/* Right Sidebar - 20% width (no header, starts from top) */}
        <Sidebar />
      </div>
      {/* Footer - Full Width */}
      <PageFooter
        onClose={onClose}
        onSave={handleSave}
        isSaveDisabled={false}
      />
    </div>
  );
}