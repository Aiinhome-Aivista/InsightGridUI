import CloseIcon from "@mui/icons-material/Close";

interface ColumnSelectionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ColumnSelectionModal({ open, onClose }: ColumnSelectionModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-[85%] h-[75%] rounded-2xl shadow-lg overflow-hidden flex flex-col">

        {/* Top Header Section */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-4">
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-200"
          >
            <i className="pi pi-arrow-left text-gray-700"></i>
          </button>

          <h1 className="text-sm font-medium text-gray-800">Column Selection</h1>

          {/* Name the Collection */}
          <input
            type="text"
            placeholder="Name the Collection"
            className="ml-6 flex-1 px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
          />

          {/* Search Column */}
          <div className="relative w-80">
            <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search Column"
              className="pl-10 w-full px-4 py-2 rounded-lg border border-gray-300 text-sm bg-gray-50 outline-none"
            />
          </div>

          {/* Multi Select */}
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-100">
            Multi Select
          </button>

          {/* Drag & Drop */}
          <button className="px-4 py-2 text-sm border border-gray-300 rounded-md bg-gray-100">
            Drag & Drop
          </button>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 px-10 py-8 overflow-hidden">

          {/* Left Column List */}
          <div className="w-[260px] pr-10 border-r border-gray-200">

            {/* Default Column */}
            <h3 className="text-xs font-medium text-gray-500 mb-2">
              Default Column (3)
            </h3>

            <div className="space-y-2 text-sm mb-6">
              <p className="text-gray-700">Sales</p>
              <p className="text-gray-700">Product</p>
              <p className="text-gray-700">Customer</p>
            </div>

            {/* Add Column */}
            <h3 className="text-xs font-medium text-gray-500 mb-2">
              Add Column (4)
            </h3>

            <div className="space-y-3 text-sm">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
                Category
              </label>

              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
                Region
              </label>

              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 mr-3" />
                Product Value
              </label>

              <label className="flex items-center">
                <input type="checkbox" className="w-4 h-4 mr-3" />
                Purchase Amount
              </label>

              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="w-4 h-4 mr-3" />
                Credit Point
              </label>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 pl-10 flex flex-col justify-between">
            <div className="flex-1"></div>

            <p className="text-xs text-gray-500 leading-relaxed mt-6">
              Add a new column by defining its name and type. It will appear instantly in your table.
              Use this section to create custom columns that help structure your data better.
              Enter the details of the column you want to add, and it will be added to your dataset.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 text-sm"
          >
            Reset
          </button>

          <button
            className="px-6 py-2 bg-gray-300 text-white rounded-lg text-sm cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
