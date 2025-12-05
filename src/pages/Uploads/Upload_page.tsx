import { useEffect, useState, useRef } from "react";
import { useTheme } from "../../theme";
import FileDropZone from "./components/FileDropZone";
import DataProcessing from "./components/DataProcessing";
import FileNameInput from "./components/FileNameInput";
import ApiService from "../../services/ApiServices";
import { GET_APIS, POST_APIS } from "../../../connection";

export default function UploadPage() {
  const { theme } = useTheme();
  const [processedFiles, setProcessedFiles] = useState<any[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionNameError, setSessionNameError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingFileName, setProcessingFileName] = useState("");
  const isInitialMount = useRef(true);
  const uploadInProgress = useRef(false);
  const currentSessionRef = useRef<{ id: string, name: string } | null>(null);
  const userData = JSON.parse(localStorage.getItem("ig_user"));
  const createdBy = userData?.user_id || "";

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      trackFiles();
    }
  }, []);

  async function trackFiles() {
    try {
      const response = await ApiService.tracker();
      setProcessedFiles(response.data?.data || []);
    } catch (error) {
      console.error('Error tracking files:', error);
    }
  }

  async function uploadFiles(files: File[]) {
    if (!files || files.length === 0) return;

    if (!sessionName || sessionName.trim() === "") {
      setSessionNameError("Session name is required before uploading files");
      return;
    }

    setSessionNameError("");

    if (uploadInProgress.current) return;

    uploadInProgress.current = true;
    setIsUploading(true);
    setIsProcessing(false);

    try {
      const sessionId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const sessionNameTrimmed = sessionName.trim();

      currentSessionRef.current = { id: sessionId, name: sessionNameTrimmed };

      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('session_name', sessionNameTrimmed);
      formData.append('created_by', createdBy);
      files.forEach(file => {
        formData.append('files', file);
      });

      setProcessingFileName(files.length > 1 ? `${files.length} files` : files[0].name);

      const uploadResponse = await ApiService.fileUpload(formData);
      const responseData = uploadResponse.data;

      if (!responseData.isSuccess) {
        throw new Error(responseData.message || 'Upload failed');
      }

      const uploadedFile = responseData.data && responseData.data.length > 0
        ? responseData.data[0]
        : null;

      if (!uploadedFile) {
        throw new Error('No file data returned from upload');
      }

      const actualSessionId = uploadedFile.session_id || sessionId;
      const actualSessionName = uploadedFile.session_name || sessionNameTrimmed;

      currentSessionRef.current = {
        id: actualSessionId,
        name: actualSessionName
      };

      const waitTime = files.reduce((total, file) => total + file.size, 0) > 5000000 ? 10000 : 7000;

      setIsUploading(false);
      setIsProcessing(true);

      await new Promise(resolve => setTimeout(resolve, waitTime));

      const verifySuccess = await verifyDataExists(actualSessionId, actualSessionName);

      if (!verifySuccess) {
        throw new Error('Data verification failed. Please try processing again manually.');
      }

      await processSessionData(actualSessionId, actualSessionName);

    } catch (error: any) {
      console.error('Error uploading files:', error);
      alert(`Error uploading files: ${error.message || 'Please try again.'}`);
      setIsUploading(false);
      setIsProcessing(false);
      uploadInProgress.current = false;
    }
  }

  async function verifyDataExists(sessionId: string, sessionName: string): Promise<boolean> {
    try {
      const response = await ApiService.tracker();
      const filesList = response.data?.data || [];

      const fileExists = filesList.some(
        (file: any) =>
          file.session_id === sessionId &&
          file.session_name === sessionName
      );

      if (!fileExists) {
        await new Promise(resolve => setTimeout(resolve, 3000));

        const retryResponse = await ApiService.tracker();
        const retryFilesList = retryResponse.data?.data || [];
        const retryExists = retryFilesList.some(
          (file: any) =>
            file.session_id === sessionId &&
            file.session_name === sessionName
        );

        return retryExists;
      }

      return true;
    } catch (error) {
      console.error('Error verifying data:', error);
      return false;
    }
  }

  async function processSessionData(sessionId: string, sessionNameTrimmed: string) {
    try {
      const requestBody = {
        session_id: sessionId,
        session_name: sessionNameTrimmed
      };

      const processResponse = await ApiService.processSessionData(requestBody);

      const globalOps = processResponse.data?.global_operations;
      if (globalOps) {
        const hasLLMError = Object.values(globalOps).some(
          (ops: any) => Array.isArray(ops) && ops.includes("LLM Error")
        );

        if (hasLLMError) {
          alert('Processing completed but some AI features failed. You can retry processing from the dashboard.');
        }
      }

      await trackFiles();

      setIsProcessing(false);
      setProcessingFileName("");
      uploadInProgress.current = false;

    } catch (processError: any) {
      console.error('Process session data error:', processError);

      setIsProcessing(false);
      setProcessingFileName("");
      uploadInProgress.current = false;

      alert(
        `Processing failed: ${processError.message}\n\n` +
        `Session ID: ${sessionId}\n` +
        `Session Name: ${sessionNameTrimmed}\n\n` +
        `Please try again using the retry button.`
      );
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

      <FileNameInput
        theme={theme}
        value={sessionName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSessionName(e.target.value);
          if (sessionNameError) {
            setSessionNameError("");
          }
        }}
        error={sessionNameError}
        disabled={isUploading || isProcessing}
      />
      <FileDropZone
        onUploadComplete={uploadFiles}
        theme={theme}
        disabled={isUploading || isProcessing}
      />
      {isProcessing && (
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
      {processedFiles.length > 0 && (
        <DataProcessing files={processedFiles} onRefresh={trackFiles}/>
      )}
    </div>
  );
}