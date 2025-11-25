interface PageFooterProps {
  onClose: () => void;
  onSave: () => void;
  isSaveDisabled: boolean;
}

function PageFooter({ onClose, onSave, isSaveDisabled }: PageFooterProps) {
  return (
    <div className="p-6 border-t border-gray-200 flex items-center justify-between">
      <p className="text-xs text-gray-500 leading-relaxed max-w-md pl-12 pr-12">
        Add a new column by defining its name and type. It will appear instantly in your table.
        Use this section to create custom columns that help structure your data better.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
        >
          Reset
        </button>

        <button
          onClick={onSave}
          disabled={isSaveDisabled}
          className={`px-6 py-2 rounded-lg text-sm ${
            isSaveDisabled
              ? 'bg-gray-300 text-[#888585] cursor-not-allowed'
              : 'bg-[#D9D9D9] text-[#888585] hover:bg[#888585] cursor-pointer'
          }`}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default PageFooter;