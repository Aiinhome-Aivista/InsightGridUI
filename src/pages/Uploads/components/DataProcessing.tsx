import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useTheme } from "../../../theme";

interface Props {
  files: File[];
}

// Define the steps for better readability
const STEPS = ["Table Extraction", "Column Extraction", "Data Mapping"];
const TOTAL_STEPS = STEPS.length;

export default function DataProcessing({ files }: Props) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [processingProgress, setProcessingProgress] = useState<Record<string, number>>({});

  // Initialize progress for each file when the component mounts or files change
  useEffect(() => {
    const initialProgress: Record<string, number> = {};
    files.forEach(file => {
      initialProgress[file.name] = 0; // Start with 0 steps completed
    });
    setProcessingProgress(initialProgress);
  }, [files]);

  const handleProcessNextStep = (fileName: string) => {
    setProcessingProgress(prev => ({
      ...prev,
      [fileName]: Math.min(prev[fileName] + 1, TOTAL_STEPS)
    }));
  };

  const handleNavigateToDashboard = () => {
    navigate('/layout/dashboard');
  };

  return (
    <div className="mt-6">
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: theme.primaryText }}
      >
        Data Processing
      </label>

      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg px-4 py-3 w-full"
            style={{ backgroundColor: theme.surface }}
          >
            {/* FILE NAME */}
            <div
              className="text-sm font-medium min-w-[140px]"
              style={{ color: theme.primaryText }}
            >
              {file.name}
            </div>

            {/* STEPS */}
            <div className="flex items-center gap-20">
              {STEPS.map((stepName, stepIndex) => {
                const currentProgress = processingProgress[file.name] || 0;
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

            {/* FILE SIZE */}
            <span
              className="text-xs min-w-[50px] text-center"
              style={{ color: theme.secondaryText }}
            >
              {(file.size / (1024 * 1024)).toFixed(2)}MB
            </span>

            {/* DATE */}
            <span
              className="text-xs min-w-[80px] text-center"
              style={{ color: theme.secondaryText }}
            >
              21-11-2025
            </span>

            {/* ACTION ICON: Refresh or Navigate */}
            {processingProgress[file.name] < TOTAL_STEPS ? (
              // REFRESH ICON
              <button onClick={() => handleProcessNextStep(file.name)}>
                <AutorenewRoundedIcon
                  className="w-5 h-5 cursor-pointer"
                  sx={{
                    color: theme.secondaryText,
                    transition: "color 0.2s",
                    "&:hover": { color: theme.primaryText },
                  }}
                />
              </button>
            ) : (
              // NEXT ARROW ICON
              <button onClick={handleNavigateToDashboard}>
                <ArrowForwardIcon
                  className="w-5 h-5 cursor-pointer"
                  sx={{ color: theme.accent, "&:hover": { color: theme.primaryText } }}
                />
              </button>
            )}

          </div>
        ))}
      </div>
    </div>
  );
}
