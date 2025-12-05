import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTheme } from "../../../theme";

interface Props {
  files: any[];
  onRefresh?: () => void | Promise<void>;
}

const STEPS = ["Table Extraction", "Column Extraction", "Data Insights"];
const TOTAL_STEPS = STEPS.length;

export default function DataProcessing({ files, onRefresh }: Props) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [processingProgress, setProcessingProgress] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const initialProgress: Record<string, number> = {};

    files.forEach(file => {
      const fileName = file.name || file.file_name;
      let progress = 0;

      if (file.table_extract_status === 'Done') {
        progress = 1;
      }
      if (file.column_extract_status === 'Done') {
        progress = 2;
      }
      if (file.data_insights_status === 'Done' || file.relationship_mapping_status === 'Done') {
        progress = 3;
      }

      initialProgress[fileName] = progress;
    });

    setProcessingProgress(initialProgress);
  }, [files]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      // Keep spinning for at least 500ms for smooth animation
      setTimeout(() => {
        setIsRefreshing(false);
      }, 500);
    }
  };

  const handleNavigateToDashboard = (file: any) => {
    const fileName = file.name || file.file_name;
    const progress = processingProgress[fileName] || 0;

    if (progress >= TOTAL_STEPS) {
      navigate('/layout/dashboard', {
        state: {
          sessionId: file.session_id,
          sessionName: file.session_name,
          fileName: fileName
        }
      });
    }
  };

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4 m-2">
        <label
          className="block text-sm font-medium"
          style={{ color: theme.primaryText }}
        >
          Uploaded Files
        </label>
        <AutorenewRoundedIcon
          className="w-5 h-5 cursor-pointer"
          sx={{
            color: theme.secondaryText,
            transition: "color 0.2s",
            "&:hover": { color: theme.primaryText },
            animation: isRefreshing ? "spin 1s linear infinite" : "none",
            "@keyframes spin": {
              "0%": {
                transform: "rotate(0deg)",
              },
              "100%": {
                transform: "rotate(360deg)",
              },
            },
          }}
          onClick={handleRefresh}
        />
      </div>

      {files.map((file, index) => {
        const fileName = file.name || file.file_name;
        const currentProgress = processingProgress[fileName] || 0;
        const isFullyProcessed = currentProgress >= TOTAL_STEPS;

        return (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg px-4 py-3 w-full"
            style={{ backgroundColor: theme.surface }}
          >
            <div
              className="text-sm font-medium min-w-[140px]"
              style={{ color: theme.primaryText }}
            >
              {fileName}
            </div>

            <div className="flex items-center gap-20">
              {STEPS.map((stepName, stepIndex) => {
                const isCompleted = stepIndex < currentProgress;
                const iconColor = isCompleted ? theme.accent : theme.secondaryText;

                return (
                  <div
                    key={stepIndex}
                    className="flex flex-col items-center"
                    style={{ color: iconColor }}
                  >
                    {isCompleted ? (
                      <CheckCircleIcon sx={{ fontSize: 20, color: iconColor }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: iconColor }} />
                    )}
                    <span className="text-[10px] mt-1">{stepName}</span>
                  </div>
                );
              })}
            </div>

            <span
              className="text-xs min-w-[50px] text-center"
              style={{ color: theme.secondaryText }}
            >
              {file.file_size || (file.size ? `${(file.size / (1024 * 1024)).toFixed(2)}MB` : 'N/A')}
            </span>

            <span
              className="text-xs min-w-[80px] text-center"
              style={{ color: theme.secondaryText }}
            >
              {file.created_at || new Date().toLocaleDateString()}
            </span>

            <div className="flex items-center gap-20 min-w-[60px] justify-end">

              <button
                onClick={() => handleNavigateToDashboard(file)}
                disabled={!isFullyProcessed}
                title={isFullyProcessed ? "View in Dashboard" : "Processing incomplete"}
              >
                <ArrowForwardIcon
                  className="w-5 h-5"
                  sx={{
                    color: isFullyProcessed ? theme.accent : theme.border,
                    cursor: isFullyProcessed ? 'pointer' : 'not-allowed',
                    transition: "color 0.2s",
                    "&:hover": {
                      color: isFullyProcessed ? theme.primaryText : theme.border
                    },
                  }}
                />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}