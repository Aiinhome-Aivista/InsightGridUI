import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
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

  const formatTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute, second] = timeStr.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12; // converts '00' → 12 AM
    return `${h}:${minute} ${ampm}`;
  };


  useEffect(() => {
    const initialProgress: Record<string, number> = {};

    files.forEach(file => {
      const fileName = file.name || file.file_name;
      let progress = 0;

      if (file.table_extraction_status?.toLowerCase() === 'done') {
        progress = 1;
      }
      if (file.column_extraction_status?.toLowerCase() === 'done') {
        progress = 2;
      }
      if (file.data_insights_status?.toLowerCase() === 'done' || file.relationship_mapping_status?.toLowerCase() === 'done') {
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
      navigate('/layout/table-insights', {
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
      <div className="flex items-center justify-between mb-4 px-2">
        <label
          className="block text-sm font-medium"
          style={{ color: theme.primaryText }}
        >
          Uploaded Files
        </label>
        <Tippy content="Refresh" theme="gray">
          <div
            onClick={handleRefresh}
            className={`relative text-center border rounded-xl w-10 h-10 flex items-center justify-center transition-colors ${isRefreshing
                ? "cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-500/10"
              }`}
            style={{ borderColor: theme.border }}
          >
            {isRefreshing ? (
              <AutorenewRoundedIcon
                className="w-5 h-5 animate-spin"
                sx={{ color: theme.secondaryText }}
              />
            ) : (
              <AutorenewRoundedIcon
                className="w-5 h-5"
                sx={{
                  color: theme.secondaryText,
                  "&:hover": { color: theme.primaryText },
                }}
              />
            )}
          </div>
        </Tippy>
      </div>

      <div className="max-h-[25vh] overflow-y-auto pr-2">
        {files.map((file, index) => {
        const fileName = file.name || file.file_name;
        const currentProgress = processingProgress[fileName] || 0;
        const isFullyProcessed = currentProgress >= TOTAL_STEPS;

        const extractionFailed =
          file.table_extraction_status?.toLowerCase() === "failed" ||
          file.table_extraction_status?.toLowerCase() === "pending";
        return (
          <div
            key={index}
            className="flex items-center rounded-lg p-3 w-full min-w-[80px] mb-3 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          >
            <div className="relative group w-[20%] min-w-[150px]">

              <div
                className="text-sm font-medium truncate"
                style={{ color: theme.primaryText }}
              >
                {fileName}
              </div>

              {/* Tooltip */}
              <div className="
                  absolute left-1/2 -translate-x-1/2 mt-1
                  hidden group-hover:block
                  whitespace-nowrap
                  bg-[#888585] text-white text-xs px-2 py-1 rounded
                  shadow-lg z-10
                "
              >
                {fileName}
              </div>
            </div>

            <div className="flex items-center min-w-[380px] w-[50%] px-4">
              {extractionFailed ? (
                <p className="text-red-500 text-sm font-medium">
                  File Extraction Failed
                </p>
              ) : (
                STEPS.map((stepName, stepIndex) => {
                  const isCompleted = stepIndex < currentProgress;
                  const iconColor = isCompleted ? theme.accent : theme.secondaryText;

                  return (
                    <div
                      key={stepIndex}
                      className="flex flex-col items-center flex-1"
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
                })
              )}
            </div>


            {/* Wrapper to group size and time, and push them to the right */}
            <div className="flex items-center justify-end flex-grow ml-auto">
              <div
                className="text-xs text-center min-w-[80px] px-2"
                style={{ color: theme.secondaryText }}
              >
                {file.file_size_mb ? `${file.file_size_mb}` : (file.size ? `${(file.size / (1024 * 1024)).toFixed(2)}MB` : 'N/A')}
              </div>
              <div
                className="text-xs text-right min-w-[180px] px-2"
                style={{ color: theme.secondaryText }}
              >
                {formatTo12Hour(file.created_at) || new Date().toLocaleDateString()}
              </div>
            </div>

            {/* <div className="flex items-center min-w-[60px] justify-end w-[5%]"> */}

              {/* <button
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
              </button> */}
            {/* </div> */}
          </div>
        );
        })}
      </div>
    </div>
  );
}