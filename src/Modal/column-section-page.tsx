import { useState } from "react";
import PageHeader from "./components/page-header";
import ColumnList from "./components/column-list";
import PageFooter from "./components/page-footer";
import Sidebar from "./components/sidebar";
import { useNavigate } from "react-router-dom";

export default function ColumnSelectionPage() {

  const navigate = useNavigate();   

  const handleBack = () => {
    navigate(-1);  
  };
  const [selectionMode, setSelectionMode] = useState(0);
  const [addColumns, setAddColumns] = useState([
    { label: 'Category', checked: true },
    { label: 'Region', checked: true },
    { label: 'Credit Point', checked: true },
    { label: 'Product Value', checked: false },
    { label: 'Purchase Amount', checked: false }
  ]);

  const handleModeChange = (index: number) => {
    setSelectionMode(index);
  };

  const handleToggleCheckbox = (label: string) => {
    setAddColumns(prev => 
      prev.map(col => 
        col.label === label ? { ...col, checked: !col.checked } : col
      )
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropToChipContainer = (e: React.DragEvent) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    const source = e.dataTransfer.getData('source');

    if (source === 'available' && item) {
      setAddColumns(prev =>
        prev.map(col =>
          col.label === item ? { ...col, checked: true } : col
        )
      );
    }
  };

  const handleRemoveChip = (index: number) => {
    const checkedColumns = addColumns.filter(col => col.checked);
    const removedLabel = checkedColumns[index].label;
    
    setAddColumns(prev =>
      prev.map(col =>
        col.label === removedLabel ? { ...col, checked: false } : col
      )
    );
  };

  const handleDragStartFromChip = (index: number) => {
    // Optional: Add visual feedback during drag
  };

  const handleDragStartFromAvailable = (label: string) => {
    // Optional: Add visual feedback during drag
  };

  const handleSave = () => {
    const selectedColumns = addColumns.filter(col => col.checked).map(col => col.label);
    console.log('Saving...', { selectionMode, selectedColumns });
  };

  const handleClose = () => {
    console.log('Closing...');
  };

  // Get available columns (unchecked items) for drag & drop mode
  const availableColumns = addColumns.filter(col => !col.checked).map(col => col.label);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Content Area - 80% width with Header */}
        <div className="w-4/5 flex flex-col">
          {/* Header */}
          <PageHeader
            onClose={handleBack}
            selectionMode={selectionMode}
            onModeChange={handleModeChange}
          />
          {/* Column List */}
          <div className="flex-1 px-10 py-8 overflow-auto">
            <ColumnList
              selectionMode={selectionMode}
              addColumns={addColumns}
              availableColumns={availableColumns}
              onRemoveChip={handleRemoveChip}
              onDrop={handleDropToChipContainer}
              onDragOver={handleDragOver}
              onDragStartFromChip={handleDragStartFromChip}
              onDragStartFromAvailable={handleDragStartFromAvailable}
              onToggleCheckbox={handleToggleCheckbox}
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
        onClose={handleClose}
        onSave={handleSave}
        isSaveDisabled={false}
      />
    </div>
  );
}