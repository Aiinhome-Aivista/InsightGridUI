import { useState, type DragEvent, type ChangeEvent, useEffect } from "react";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import UploadLoader from "./UploadLoader";

interface Props {
  file: File | null;
  setFile: (file: File | null) => void;
  theme: any;
}

export default function FileDropZone({ file, setFile, theme }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      startUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      startUpload(e.target.files[0]);
    }
  };

  const startUpload = (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);
    setProgress(0);
    setUploadComplete(false);
  };

  const handleReupload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xls,.xlsx,.pdf";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        startUpload(target.files[0]);
      }
    };
    input.click();
  };

  const handleDelete = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
  };

  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          return 100;
        }
        return p + 1.5;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [uploading]);

  return (
    <div>
      <label
        className="block text-sm font-medium mb-2"
        style={{ color: theme.primaryText }}
      >
        Upload File
      </label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center w-full h-44 rounded-lg border-2 border-dashed transition 
${dragActive ? "border-[#182938]" : "border-[#BCC7D2]"} bg-[#FAFAFA] p-4`}
      >
        {!uploading ? (
          <>
            <BackupOutlinedIcon className="w-10 h-10 text-[#7E8489] mb-2" />
            <p
              className="text-sm text-center"
              style={{ color: theme.secondaryText }}
            >
              Click to upload or drag and drop <br /> CSV, EXC, PDF (MAX 10MB)
            </p>
            <label className="mt-3">
              <input type="file" onChange={handleFileChange} className="hidden" />
              <span
                className="cursor-pointer text-sm font-medium px-4 py-2 rounded-md"
                style={{
                  color: theme.primaryText,
                  backgroundColor: theme.surface,
                }}
              >
                Or Select a File
              </span>
            </label>
            {file && (
              <p
                className="text-xs mt-2"
                style={{ color: theme.secondaryText }}
              >
                Selected file: <span className="font-semibold">{file.name}</span>
              </p>
            )}
          </>
        ) : (
          <UploadLoader fileName={file?.name} progress={progress} />
        )}

        {/* Re-upload and Delete buttons - shown after upload complete */}
        {uploadComplete && (
          <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
            {/* Re-upload button */}
            <button
              onClick={handleReupload}
              className="flex flex-row items-center gap-4 bg-[#D9D9D9] hover:bg-[#D8DADD] rounded-lg px-3 py-2 transition-colors"
              title="Re-upload"
            >
              <span className="text-xs font-medium text-[#5F6368]">
                Re-upload
              </span>
              <img 
                src="/src/assets/reupload.svg" 
                alt="Re-upload" 
                className="w-4 h-4"
              />
            </button>

            {/* Delete button */}
            <button
              onClick={handleDelete}
              className="flex items-center justify-center hover:opacity-70 transition-opacity p-1"
              title="Delete"
            >
              <img 
                src="/src/assets/deleteIcon.svg" 
                alt="Delete" 
                className="w-4 h-4"
              />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}