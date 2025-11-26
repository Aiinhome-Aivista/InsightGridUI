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

export default function ColumnSelectionPage() {
  const [selectionMode, setSelectionMode] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'Category',
    'Region',
    'Credit Point'
  ]);
  const [availableColumns, setAvailableColumns] = useState<string[]>([
    'Product Value',
    'Purchase Amount'
  ]);
  const [draggedItem, setDraggedItem] = useState<string>('');

  const handleModeChange = (index: number) => {
    setSelectionMode(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToChipContainer = (e: React.DragEvent) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');

    if (source === 'available' && item) {
      // Add to selected columns
      setSelectedColumns(prev => [...prev, item]);
      // Remove from available columns
      setAvailableColumns(prev => prev.filter(col => col !== item));
    }
  };

  const handleRemoveChip = (index: number) => {
    const removedItem = selectedColumns[index];
    // Remove from selected columns
    setSelectedColumns(prev => prev.filter((_, i) => i !== index));
    // Add back to available columns at the end
    setAvailableColumns(prev => [...prev, removedItem]);
  };

  const handleDragStartFromChip = (index: number) => {
    setDraggedItem(selectedColumns[index]);
  };

  const handleDragStartFromAvailable = (label: string) => {
    setDraggedItem(label);
  };

  const handleSave = () => {
    console.log('Saving...', { selectionMode, selectedColumns, availableColumns });
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Content Area - 80% width with Header */}
        <div className="w-4/5 flex flex-col">
          {/* Header */}
          <PageHeader
            onClose={() => console.log('Close')}
            selectionMode={selectionMode}
            onModeChange={handleModeChange}
          />
          {/* Column List */}
          <div className="flex-1 px-10 py-8 overflow-auto">
            <ColumnList
              selectionMode={selectionMode}
              selectedColumns={selectedColumns}
              availableColumns={availableColumns}
              onRemoveChip={handleRemoveChip}
              onDrop={handleDropToChipContainer}
              onDragOver={handleDragOver}
              onDragStartFromChip={handleDragStartFromChip}
              onDragStartFromAvailable={handleDragStartFromAvailable}
            />
          </div>
        </div>
        {/* Vertical Divider */}
        <div className="w-px bg-gray-200"></div>
        {/* Right Sidebar - 20% width */}
        <Sidebar />
      </div>
      {/* Footer - Full Width */}
      <PageFooter
        onClose={() => console.log('Reset')}
        onSave={handleSave}
        isSaveDisabled={false}
      />
    </div>
  );
}