import { useEffect, useState } from "react";
import { useTheme } from "../../theme";
import FileDropZone from "./components/FileDropZone";
import DataProcessing from "./components/DataProcessing";
import FileNameInput from "./components/FileNameInput";
import ApiService from "../../services/ApiServices";
import { GET_APIS, POST_APIS } from "../../../connection";

export default function UploadPage() {
  const { theme } = useTheme();
  const [processedFiles, setProcessedFiles] = useState<any[]>([]);

  useEffect(() => {
    trackFiles();
  }, []);

  async function trackFiles() {
    try {
      const response = await ApiService(GET_APIS.tracker, 'GET');
      console.log('File tracking response:', response);
      // Update the processed files state with the response data
      setProcessedFiles(response.data);
    } catch (error) {
      console.error('Error tracking files:', error);
    }
  }

  async function uploadFiles(files: File[]) {
    try {
      const formData = new FormData();
      formData.append('session_id', Math.random().toString(36).substring(2, 15));
      formData.append('session_name', 'default');
      files.forEach(file => {
        formData.append('files', file);
      });
      await ApiService(POST_APIS.fileUpload, {
        method: "POST",
        body: formData,
      }, true);
      trackFiles(); // Refresh the file list after upload
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }

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
        <FileNameInput theme={theme} value={""} onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
          throw new Error("Function not implemented.");
        } } />
        <FileDropZone
          onUploadComplete={uploadFiles}
          theme={theme}
        />
        {/* Data Processing Under Upload Box */}
        {processedFiles.length > 0 && <DataProcessing files={processedFiles} />}
      </div>
    </div>
  );
}