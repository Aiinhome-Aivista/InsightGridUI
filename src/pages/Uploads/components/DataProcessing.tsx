import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import { useTheme } from "../../../theme";
import DeleteIcon from '@mui/icons-material/Delete';
import ApiServices from "../../../services/ApiServices";
import { useAuth } from "../../Auth/AuthContext";

interface Props {
  files: any[];
  onRefresh?: () => void | Promise<void>;
}

const STEPS = ["Table Extraction", "Column Extraction", "Data Insert Status"];
const TOTAL_STEPS = STEPS.length;

export default function DataProcessing({ files, onRefresh }: Props) {
  const { user } = useAuth();

  const { theme } = useTheme();
  const navigate = useNavigate();
  const [processingProgress, setProcessingProgress] = useState<Record<string, number>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const [hour, minute, second] = timeStr.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
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
      if (file.data_insert_status?.toLowerCase() === 'done') {
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

  const handleDeleteFile = async (file: any) => {
    try {
      const payload = {
        session_id: user?.session_id,
        created_by: user?.user_id,
        file_name: file.name || file.file_name,
      };

      const res = await ApiServices.deleteUploadedFile(payload);

      // ✅ SUCCESS
      if (res?.success) {
        if (onRefresh) {
          await onRefresh();
        }
        return;
      }

      // ⚠️ DEPENDENCY CASE (409)
      if (res?.data?.dependencies?.length) {
        const tables = res.data.dependencies
          .map((d: any) => d.table_name)
          .join(", ");

        alert(
          `Cannot delete this file.\n\nIt is used by tables:\n${tables}`
        );
        return;
      }

      // ❌ GENERIC FAILURE
      alert(res?.message || "Unable to delete file");

    } catch (error: any) {
      console.error("Delete failed", error);
      alert("Something went wrong while deleting file");
    }
  };


  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2 px-2">
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

      {/* Global Column Headers */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-4 px-4 py-2 rounded-lg" style={{ backgroundColor: theme.border + '20' }}>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold" style={{ color: theme.secondaryText }}>
              File Name
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold" style={{ color: theme.secondaryText }}>
              Table Name
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold" style={{ color: theme.secondaryText }}>
              Rows Affected
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-center" style={{ color: theme.secondaryText }}>
              Table Extraction
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-center" style={{ color: theme.secondaryText }}>
              Column Extraction
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-center" style={{ color: theme.secondaryText }}>
              Data Insert Status
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-center" style={{ color: theme.secondaryText }}>
              File Size
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-center" style={{ color: theme.secondaryText }}>
              Uploaded At
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-center" style={{ color: theme.secondaryText }}>
              Action
            </div>
          </div>

        </div>
      </div>

      <div className="max-h-[30vh] overflow-y-auto pr-2">
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
              className="rounded-lg p-4 w-full mb-3 bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
            >
              <div className="flex items-center justify-between gap-4">
                {/* File Name */}
                <div className="flex-1 min-w-0">
                  <div className="relative group">
                    <div
                      className="text-sm font-medium truncate"
                      style={{ color: theme.primaryText }}
                    >
                      {fileName}
                    </div>
                    <div className="absolute left-0 mt-1 hidden group-hover:block whitespace-nowrap bg-[#888585] text-white text-xs px-2 py-1 rounded shadow-lg z-10">
                      {fileName}
                    </div>
                  </div>
                </div>

                {/* Table Name */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: theme.primaryText }}
                  >
                    {file.table_name || 'N/A'}
                  </div>
                </div>

                {/* Rows Affected */}
                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-medium"
                    style={{ color: theme.primaryText }}
                  >
                    {file.rows_effected || 0}
                  </div>
                </div>

                {/* Table Extraction Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-center">
                    {extractionFailed ? (
                      <span className="text-red-500 text-xs font-medium">Failed</span>
                    ) : file.table_extraction_status?.toLowerCase() === 'done' ? (
                      <CheckCircleIcon sx={{ fontSize: 20, color: theme.accent }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: theme.secondaryText }} />
                    )}
                  </div>
                </div>

                {/* Column Extraction Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-center">
                    {file.column_extraction_status?.toLowerCase() === 'done' ? (
                      <CheckCircleIcon sx={{ fontSize: 20, color: theme.accent }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: theme.secondaryText }} />
                    )}
                  </div>
                </div>

                {/* Data Insert Status */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-center">
                    {file.data_insert_status?.toLowerCase() === 'done' ? (
                      <CheckCircleIcon sx={{ fontSize: 20, color: theme.accent }} />
                    ) : (
                      <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: theme.secondaryText }} />
                    )}
                  </div>
                </div>

                {/* File Size */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-center" style={{ color: theme.primaryText }}>
                    {file.file_size_mb || (file.size ? `${(file.size / (1024 * 1024)).toFixed(2)}MB` : 'N/A')}
                  </div>
                </div>

                {/* Uploaded At */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-center" style={{ color: theme.primaryText }}>
                    {formatTo12Hour(file.created_at) || new Date().toLocaleDateString()}
                  </div>
                </div>

                {/* Delete Icon */}
                <div className="flex-1 min-w-0 flex justify-center">
                  <Tippy content="Delete file" theme="gray">
                    <DeleteIcon
                      onClick={() => handleDeleteFile(file)}
                      sx={{
                        fontSize: 20,
                        color: "#9ca3af", // grey
                        cursor: "pointer",
                        "&:hover": {
                          color: "#ef4444", // red on hover
                        },
                      }}
                    />
                  </Tippy>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}