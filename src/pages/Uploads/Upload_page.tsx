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
  const currentSessionRef = useRef<{id: string, name: string} | null>(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      trackFiles();
    }
  }, []);

  async function trackFiles() {
    try {
      const response = await ApiService.tracker();
      console.log('File tracking response:', response);
      // The actual file list is likely nested in response.data.data
      setProcessedFiles(response.data?.data || []);
    } catch (error) {
      console.error('Error tracking files:', error);
    }
  }

  async function uploadFiles(files: File[]) {
    if (!files || files.length === 0) {
      console.log('No files to upload, skipping...');
      return;
    }

    if (!sessionName || sessionName.trim() === "") {
      setSessionNameError("Session name is required before uploading files");
      return;
    }

    setSessionNameError("");

    if (uploadInProgress.current) {
      console.log('Upload already in progress, skipping...');
      return;
    }

    uploadInProgress.current = true;
    setIsUploading(true);
    setIsProcessing(false);

    try {
      const sessionId = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const sessionNameTrimmed = sessionName.trim();

      // Store session info for later use
      currentSessionRef.current = { id: sessionId, name: sessionNameTrimmed };

      const formData = new FormData();
      formData.append('session_id', sessionId);
      formData.append('session_name', sessionNameTrimmed);
      files.forEach(file => {
        formData.append('files', file);
      });

      setProcessingFileName(files.length > 1 ? `${files.length} files` : files[0].name);

      console.log('=== UPLOAD REQUEST ===');
      console.log('Session ID:', sessionId);
      console.log('Session Name:', sessionNameTrimmed);
      console.log('Files:', files.map(f => f.name));
      console.log('Timestamp:', new Date().toISOString());

      // Step 1: Upload files
      const uploadResponse = await ApiService.fileUpload(formData);

      console.log('=== UPLOAD RESPONSE ===');
      console.log('Full Response:', uploadResponse);
      console.log('Upload completed at:', new Date().toISOString());

      const responseData = uploadResponse.data;

      if (!responseData.isSuccess) {
        throw new Error(responseData.message || 'Upload failed');
      }

      // Extract session info from response
      const uploadedFile = responseData.data && responseData.data.length > 0 
        ? responseData.data[0] 
        : null;

      if (!uploadedFile) {
        throw new Error('No file data returned from upload');
      }

      const actualSessionId = uploadedFile.session_id || sessionId;
      const actualSessionName = uploadedFile.session_name || sessionNameTrimmed;

      console.log('=== EXTRACTED SESSION INFO ===');
      console.log('Actual Session ID:', actualSessionId);
      console.log('Actual Session Name:', actualSessionName);

      // Update ref with actual values
      currentSessionRef.current = { 
        id: actualSessionId, 
        name: actualSessionName 
      };

      // ✅ CRITICAL FIX: Wait longer for database commit
      // Large files with multiple chunks need more time
      const waitTime = files.reduce((total, file) => total + file.size, 0) > 5000000 ? 10000 : 7000;
      
      console.log('=== WAITING FOR DATABASE COMMIT ===');
      console.log(`File size total: ${files.reduce((total, file) => total + file.size, 0)} bytes`);
      console.log(`Waiting ${waitTime}ms for database commit...`);
      console.log('Wait started at:', new Date().toISOString());

      setIsUploading(false);
      setIsProcessing(true);

      await new Promise(resolve => setTimeout(resolve, waitTime));

      console.log('Wait completed at:', new Date().toISOString());
      console.log('=== STARTING PROCESSING ===');

      // Step 2: Verify data exists before processing
      const verifySuccess = await verifyDataExists(actualSessionId, actualSessionName);
      
      if (!verifySuccess) {
        throw new Error('Data verification failed. Please try processing again manually.');
      }

      // Step 3: Process session data
      await processSessionData(actualSessionId, actualSessionName);

    } catch (error: any) {
      console.error('Error uploading files:', error);
      alert(`Error uploading files: ${error.message || 'Please try again.'}`);
      setIsUploading(false);
      setIsProcessing(false);
      uploadInProgress.current = false;
    }
  }

  // ✅ NEW: Verify data exists before processing
  async function verifyDataExists(sessionId: string, sessionName: string): Promise<boolean> {
    try {
      console.log('=== VERIFYING DATA EXISTS ===');
      console.log('Verification started at:', new Date().toISOString());
      
      const response = await ApiService.tracker();
      const filesList = response.data?.data || [];
      
      const fileExists = filesList.some(
        (file: any) => 
          file.session_id === sessionId && 
          file.session_name === sessionName
      );

      console.log('File exists in database:', fileExists);
      
      if (!fileExists) {
        console.warn('⚠️ File not found in database yet, waiting additional 3 seconds...');
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Retry verification
        const retryResponse = await ApiService.tracker();
        const retryFilesList = retryResponse.data?.data || [];
        const retryExists = retryFilesList.some(
          (file: any) => 
            file.session_id === sessionId && 
            file.session_name === sessionName
        );
        
        console.log('Retry - File exists:', retryExists);
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
      console.log('=== PROCESS SESSION DATA REQUEST ===');
      console.log('Process started at:', new Date().toISOString());
      
      const requestBody = {
        session_id: sessionId,
        session_name: sessionNameTrimmed
      };
      
      console.log('Request Body:', JSON.stringify(requestBody, null, 2));
      console.log('Request URL:', POST_APIS.processSessionData);

      const processResponse = await ApiService.processSessionData(requestBody);

      console.log('=== PROCESS SESSION DATA RESPONSE ===');
      console.log('Process completed at:', new Date().toISOString());
      console.log('Success! Response:', processResponse);

      // Check if global_operations contains LLM errors
      const globalOps = processResponse.data?.global_operations;
      if (globalOps) {
        const hasLLMError = Object.values(globalOps).some(
          (ops: any) => Array.isArray(ops) && ops.includes("LLM Error")
        );
        
        if (hasLLMError) {
          console.warn('⚠️ LLM Error detected in response');
          alert('Processing completed but some AI features failed. You can retry processing from the dashboard.');
        }
      }

      // Refresh file list
      await trackFiles();
      
      setIsProcessing(false);
      setProcessingFileName("");
      uploadInProgress.current = false;

    } catch (processError: any) {
      console.error('=== PROCESS SESSION DATA ERROR ===');
      console.error('Error occurred at:', new Date().toISOString());
      console.error('Error:', processError);
      console.error('Error Message:', processError.message);
      
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

  // Manual refresh function for retry
  const handleManualProcess = async () => {
    if (!currentSessionRef.current) {
      alert('No recent upload session found. Please upload a file first.');
      return;
    }

    console.log('=== MANUAL RETRY TRIGGERED ===');
    console.log('Retry started at:', new Date().toISOString());
    setIsProcessing(true);
    
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    await processSessionData(currentSessionRef.current.id, currentSessionRef.current.name);
  };

  return (
    <div
      className="flex flex-col items-start w-full h-full p-8"
      style={{ backgroundColor: theme.background }}
    >
      <div className="w-full rounded-lg" style={{ backgroundColor: theme.surface }}>
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

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="mt-4 p-4 rounded-lg border" style={{ 
            backgroundColor: theme.surface,
            borderColor: theme.border 
          }}>
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2" style={{ 
                borderColor: theme.accent 
              }}></div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: theme.primaryText }}>
                  Processing {processingFileName}...
                </p>
                <p className="text-xs mt-1" style={{ color: theme.secondaryText }}>
                  Extracting tables, columns, and analyzing data with AI. This may take a few moments.
                </p>
              </div>
              <button
                onClick={handleManualProcess}
                className="px-3 py-1 text-xs rounded border hover:bg-opacity-80"
                style={{ 
                  borderColor: theme.border,
                  color: theme.primaryText 
                }}
              >
                Retry
              </button>
            </div>
          </div>
        )}
        
        {/* Data Processing */}
        {processedFiles.length > 0 && (
          <DataProcessing files={processedFiles} onRefresh={handleManualProcess} />
        )}
      </div>
    </div>
  );
}