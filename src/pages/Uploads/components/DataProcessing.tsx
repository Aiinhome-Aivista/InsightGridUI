import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useTheme } from "../../../theme";

interface Props {
  files: File[];
}

export default function DataProcessing({ files }: Props) {
  const { theme } = useTheme();

  return (
    <div className="mt-6">
      <label className="block text-sm font-medium mb-2" style={{ color: theme.primaryText }}>
        Data Processing
      </label>

      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg p-4 w-full"
            style={{ backgroundColor: theme.surface }}
          >
            <div className="text-sm font-semibold" style={{ color: theme.primaryText }}>{file.name}</div>

            <div className="flex items-center gap-12">
              {/* Step 1 — Completed */}
              <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
                <CheckCircleIcon sx={{ color: theme.secondaryText }} />
                <span className="text-xs mt-1">Table Extraction</span>
              </div>

              {/* Step 2 — Completed */}
              <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
                <CheckCircleIcon sx={{ color: theme.secondaryText }} />
                <span className="text-xs mt-1">Column Extraction</span>
              </div>

              {/* Step 3 — Pending */}
              <div className="flex flex-col items-center" style={{ color: theme.secondaryText }}>
                <RadioButtonUncheckedIcon sx={{ color: theme.secondaryText }} />
                <span className="text-xs mt-1">Data Mapping</span>
              </div>
            </div>
            <ArrowForwardIosIcon sx={{ color: theme.secondaryText }} />
          </div>
        ))}
      </div>
    </div>
  );
}
