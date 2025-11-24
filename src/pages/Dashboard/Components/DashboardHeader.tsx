// Components/DashboardHeader.tsx
import { InputText } from "primereact/inputtext";

interface HeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export default function DashboardHeader({
  globalFilter,
  setGlobalFilter,
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Left: Title + Subtitle */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900">
              Tabular view
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Start by uploading a data file to create your first view.
            </p>
          </div>

          {/* Center: Search */}
          <div className="flex-1 flex justify-center px-4">
            <div className="relative w-full max-w-2xl">
              <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <InputText
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Global Search"
                className="pl-10 w-full h-10 rounded-xl border border-gray-300 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="pi pi-cog text-gray-600 text-lg"></i>
            </button>

            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <i className="pi pi-refresh text-gray-600 text-lg"></i>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
