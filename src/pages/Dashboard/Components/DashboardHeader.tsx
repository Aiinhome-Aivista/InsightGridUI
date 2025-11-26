import { useState } from "react";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ViewColumnRoundedIcon from "@mui/icons-material/ViewColumnRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { InputText } from "primereact/inputtext";
import ColumnSelectionPage from "../../../Modal/column-section-page";
import { useTheme } from "../../../theme";

interface HeaderProps {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
}

export default function DashboardHeader({
  globalFilter,
  setGlobalFilter,
}: HeaderProps) {
  const [showColumnModal, setShowColumnModal] = useState(false);
  const { theme } = useTheme();

  return (
    <>
      <header
        style={{ backgroundColor: theme.surface }}
        className="w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Responsive Flex Container */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between h-auto md:h-20 py-4 md:py-0">

            {/* Left Section */}
            <div className="flex-shrink-0 text-center md:text-left">
              <h1 className="text-xl font-semibold" style={{ color: theme.primaryText }}>
                Tabular view
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: theme.secondaryText }}
              >
                Start by uploading a data file to create your first view.
              </p>
            </div>

            {/* Center Search Bar */}
            <div className="w-full md:flex-1 flex justify-center order-3 md:order-none">
              <div className="relative w-full max-w-md md:max-w-2xl">
                <SearchRoundedIcon
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  sx={{ color: theme.secondaryText }}
                />

                <InputText
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  placeholder="Global Search"
                  className="pl-10 w-full h-10 rounded-xl border text-sm"
                  style={{
                    backgroundColor: theme.background,
                    color: theme.primaryText,
                    borderColor: theme.border,
                  }}
                />
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              {/* Column Selection */}
              <div
                onClick={() => setShowColumnModal(true)}
                className="relative text-center border rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-500/10 transition-colors"
                style={{ borderColor: theme.border }}
              >
                <ViewColumnRoundedIcon
                  className="w-5 h-5"
                  sx={{
                    color: theme.secondaryText,
                    transition: "color 0.2s",
                    "&:hover": { color: theme.primaryText },
                  }}
                />
              </div>

              {/* Refresh */}
              <div
                className="relative text-center border rounded-xl w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-gray-500/10 transition-colors"
                style={{ borderColor: theme.border }}
              >
                <AutorenewRoundedIcon
                  className="w-5 h-5"
                  sx={{
                    color: theme.secondaryText,
                    transition: "color 0.2s",
                    "&:hover": { color: theme.primaryText },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {showColumnModal && <ColumnSelectionPage />}
    </>
  );
}
