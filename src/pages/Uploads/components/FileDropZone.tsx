import { useState, useEffect, useRef, type DragEvent } from "react";
import UploadIdle from "./UploadIdle";
import UploadProgress from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";
import UploadActions from "./UploadActions";

interface Props {
  onUploadComplete: (files: File[]) => void;
  theme: any;
  disabled?: boolean;
}

export default function FileDropZone({ onUploadComplete, theme, disabled = false }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const uploadCalledRef = useRef(false); // Prevent duplicate calls

  const startUpload = (selectedFiles: File[]) => {
    if (!selectedFiles || selectedFiles.length === 0 || disabled) {
      return;
    }

    setFiles(selectedFiles);
    setUploading(true);
    setProgress(0);
    setUploadComplete(false);
    uploadCalledRef.current = false; // Reset flag
  };

  const handleDelete = () => {
    setFiles([]);
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
    uploadCalledRef.current = false;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    if (disabled) {
      return;
    }
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      startUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    if (disabled) {
      return;
    }
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    }
    if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  useEffect(() => {
    if (!uploading || files.length === 0) return;
    
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          
          // Call onUploadComplete only once
          if (!uploadCalledRef.current) {
            uploadCalledRef.current = true;
            setTimeout(() => onUploadComplete(files), 300);
          }
          
          return 100;
        }
        return p + 1.2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [uploading, files.length]); // Only depend on uploading and files.length

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium" style={{ color: theme.primaryText }}>Upload File</p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full h-44 rounded-xl border-2 border-dashed flex items-center justify-center transition ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        style={{
          backgroundColor: theme.surface,
          borderColor: dragActive ? theme.accent : theme.border,
        }}
      >
        {files.length === 0 ? (
          <UploadIdle onFileSelect={startUpload} disabled={disabled} />
        ) : uploading ? (
          <UploadProgress fileName={files.length > 1 ? `${files.length} files` : files[0].name} progress={progress} />
        ) : uploadComplete ? (
          <>
            <UploadSuccess fileName={files.length > 1 ? `${files.length} files` : files[0].name} />
            <UploadActions
              onReupload={() => startUpload(files)}
              onDelete={handleDelete}
              disabled={disabled}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}