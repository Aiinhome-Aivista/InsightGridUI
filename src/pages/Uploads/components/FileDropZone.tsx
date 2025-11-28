import { useState, useEffect, type DragEvent } from "react";
import UploadIdle from "./UploadIdle";
import UploadProgress from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";
import UploadActions from "./UploadActions";

interface Props {
  onUploadComplete: (files: File[]) => void;
  theme: any;
}

export default function FileDropZone({ onUploadComplete, theme }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const startUpload = (selectedFiles: File[]) => {
    setFiles(selectedFiles);
    setUploading(true);
    setProgress(0);
    setUploadComplete(false);
    onUploadComplete([]); // Clear previous files
  };

  const handleDelete = () => {
    setFiles([]);
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
    onUploadComplete([]); // Also clear files in the parent component
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files) startUpload(Array.from(e.dataTransfer.files));
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  useEffect(() => {
    if (!uploading || files.length === 0) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          setTimeout(() => onUploadComplete(files), 600);
          return 100;
        }
        return p + 1.2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [uploading, files, onUploadComplete]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium" style={{ color: theme.primaryText }}>Upload File</p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full h-44 rounded-xl border-2 border-dashed flex items-center justify-center transition`}
        style={{
          backgroundColor: theme.surface,
          borderColor: dragActive ? theme.accent : theme.border,
        }}
      >
        {files.length === 0 ? (
          <UploadIdle onFileSelect={startUpload} />
        ) : uploading ? (
          <UploadProgress fileName={files.length > 1 ? `${files.length} files` : files[0].name} progress={progress} />
        ) : uploadComplete ? (
          <>
            <UploadSuccess fileName={files.length > 1 ? `${files.length} files` : files[0].name} />
            <UploadActions
              onReupload={() => startUpload(files)}
              onDelete={handleDelete}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}
