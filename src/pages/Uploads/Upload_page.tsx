import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../theme";
import FileDropZone from "./components/FileDropZone";
import DataProcessing from "./components/DataProcessing";
import ApiService from "../../services/ApiServices";
import { useAuth } from "../Auth/AuthContext";
import TableImportModal from "./modal/table-import-modal";

export default function UploadPage() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [processedFiles, setProcessedFiles] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileName, setProcessingFileName] = useState("");
  const isInitialMount = useRef(true);
  const uploadInProgress = useRef(false);
  const createdBy = user?.user_id || "";
  const [noFileMessage, setNoFileMessage] = useState("");
  const sessionId = user?.session_id || "";

  // ADD THESE TWO LINES
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [uploadResponseData, setUploadResponseData] = useState<any>(null);
  const [resetKey, setResetKey] = useState(0);


  

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      trackFiles();
    }
  }, [createdBy, sessionId]);



  async function trackFiles() {
    const payload = { created_by: createdBy, session_id: sessionId };
    try {
      const response = await ApiService.tracker(payload);
      if (response.data.isSuccess) {
        const files = response.data?.data || [];
        setProcessedFiles(files);
        if (files.length === 0) {
          setNoFileMessage(response.data?.message || "No files found");
        } else {
          setNoFileMessage("");
        }
      } else {
        setProcessedFiles([]);
        setNoFileMessage(response.data?.message || "Failed to retrieve files.");
      }
    } catch (error: any) {
      console.error("Error tracking files:", error);
      const message =
        error.response?.data?.message || error.message || "An unknown error occurred";
      setProcessedFiles([]);
      setNoFileMessage(message);
    }
  }


  async function uploadFiles(files: File[]) {
    if (!files || files.length === 0) return;
    if (uploadInProgress.current) return;
    uploadInProgress.current = true;
    setIsUploading(true);
    setIsProcessing(false);
    try {
      const formData = new FormData();
      formData.append("action", "upload");
      formData.append("session_id", sessionId);
      formData.append("created_by", createdBy);
      formData.append("has_header", "true");
      files.forEach((file) => {
        formData.append("files", file);
      });
      setProcessingFileName(
        files.length > 1 ? `${files.length} files` : files[0].name
      );
      const uploadResponse = await ApiService.fileUpload(formData);
      console.log("Upload Response:", uploadResponse?.data);
      const responseData = uploadResponse?.data;
      if (!responseData?.isSuccess) {
        console.error("Upload failed:", responseData?.message);
        return;
      }
      const fileInfo = responseData.data;
      if (!fileInfo) {
        console.error("File info missing.");
        return;
      }
      setUploadedFileName(fileInfo.file_name || files[0].name);
      setUploadResponseData(fileInfo);
      setIsModalOpen(true);
      setResetKey((prev) => prev + 1);

      setIsUploading(false);
      setIsProcessing(false);

      await trackFiles();
    } catch (error: any) {
      console.error("Upload error:", error?.message || error);
    } finally {
      uploadInProgress.current = false;
      setIsUploading(false);
      setIsProcessing(false);
    }
  }
  return (
    <div className="w-full rounded-lg p-8">
      <h2
        className="text-center text-xl font-semibold"
        style={{ color: theme.primaryText }}
      >
        Upload your data
      </h2>

      <p
        className="text-center text-xs mb-6"
        style={{ color: theme.secondaryText }}
      >
        Start by uploading a data file to create your first view.
      </p>

      <FileDropZone
        key={resetKey}
        onUploadComplete={uploadFiles}
        theme={theme}
        disabled={isUploading || isProcessing}
      />

      {(isProcessing || isUploading) && (
        <div className="flex flex-col items-center justify-center gap-3 mt-4">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{
              borderColor: theme.accent
            }}></div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: theme.primaryText }}>
                Processing {processingFileName}...
              </p>
            </div>
          </div>
        </div>
      )}

      {processedFiles.length > 0 ? (
        <DataProcessing files={processedFiles} onRefresh={trackFiles} />
      ) : (
        <div className="flex justify-center mt-40">
          <p
            className="text-center text-sm"
            style={{ color: theme.secondaryText }}
          >
            {noFileMessage}
          </p>
        </div>
      )}
      <TableImportModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onFinish={trackFiles}
        uploadedFileName={uploadedFileName}
        apiData={uploadResponseData}
      />
    </div>
  );
}