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

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      trackFiles();
    }
  }, []);

  async function trackFiles() {
    try {
      const response = await ApiService(GET_APIS.tracker, { method: 'GET' });
      setProcessedFiles(response.data || []);
    } catch (error) {
    }
  }

  async function uploadFiles(files: File[]) {
    if (!files || files.length === 0) {
      return;
    }

    if (!sessionName || sessionName.trim() === "") {
      setSessionNameError("Session name is required before uploading files");
      return;
    }

    setSessionNameError("");

    if (uploadInProgress.current) {
      return;
    }

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
      files.forEach(file => {
        formData.append('files', file);
      });

      setProcessingFileName(files.length > 1 ? `${files.length} files` : files[0].name);
      const uploadResponse = await ApiService(
        POST_APIS.fileUpload,
        {
          method: "POST",
          body: formData,
        },
        true
      );

      if (!uploadResponse.isSuccess) {
        throw new Error(uploadResponse.message || 'Upload failed');
      }

      let uploadedFile = null;

      if (Array.isArray(uploadResponse.data) && uploadResponse.data.length > 0) {
        uploadedFile = uploadResponse.data[0];
      } else if (uploadResponse.data && typeof uploadResponse.data === 'object') {
        uploadedFile = uploadResponse.data;
      }

      if (!uploadedFile) {
        throw new Error('No file data in response');
      }

      if (uploadedFile.upload_status === "Failed" || uploadedFile.error) {
        throw new Error(uploadedFile.error || 'Upload failed');
      }

      const actualSessionId = uploadedFile.session_id || sessionId;
      const actualSessionName = uploadedFile.session_name || sessionNameTrimmed;

      currentSessionRef.current = {
        id: actualSessionId,
        name: actualSessionName
      };

      setIsUploading(false);
      setIsProcessing(true);

      await new Promise(resolve => setTimeout(resolve, 3000));

      const verifySuccess = await verifyDataExistsDetailed(actualSessionId, actualSessionName);

      if (!verifySuccess) {
        throw new Error('Data verification failed. Check console logs for details.');
      }
      
      await processSessionData(actualSessionId, actualSessionName);

    } catch (error: any) {
      setIsUploading(false);
      setIsProcessing(false);
      uploadInProgress.current = false;
    }
  }

  async function verifyDataExistsDetailed(
    sessionId: string,
    sessionName: string
  ): Promise<boolean> {
    const maxRetries = 8;
    const baseDelay = 1500;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const response = await ApiService(GET_APIS.tracker, { method: 'GET' });

        const fileExists = response.data?.some((file: any) => {
          const idMatch = file.session_id === sessionId;
          const nameMatch = file.session_name === sessionName;
          return idMatch && nameMatch;
        });

        if (fileExists) {
          return true;
        }

        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(1.5, attempt);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      } catch (error) {
      }
    }

    return false;
  }

  async function processSessionData(sessionId: string, sessionNameTrimmed: string) {
    try {
      const requestBody = {
        session_id: sessionId,
        session_name: sessionNameTrimmed
      };

      const processResponse = await ApiService(
        POST_APIS.processSessionData,
        {
          method: "POST",
          body: requestBody,
        }
      );

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
        <div className="flex items-center gap-3 pt-4">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{
            borderColor: theme.accent
          }}></div>
          <div className="flex-1">
            <p className="text-sm font-medium" style={{ color: theme.primaryText }}>
              Processing {processingFileName}...
            </p>
          </div>
        </div>
      )}

      {processedFiles.length > 0 && (
        <DataProcessing files={processedFiles} onRefresh={trackFiles} />
      )}
    </div>
  );
}