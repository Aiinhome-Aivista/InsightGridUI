import { useState, useEffect, type DragEvent } from "react";
import UploadIdle from "./UploadIdle";
import UploadProgress from "./UploadProgress";
import UploadSuccess from "./UploadSuccess";
import UploadActions from "./UploadActions";
import DataProcessing from "./DataProcessing";

interface Props {
  file: File | null;
  setFile: (file: File | null) => void;
  theme: any;
}

export default function FileDropZone({ file, setFile }: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [showProcessing, setShowProcessing] = useState(false);

  const startUpload = (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);
    setProgress(0);
    setUploadComplete(false);
    setShowProcessing(false);
  };

  const handleDelete = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
    setShowProcessing(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) startUpload(e.dataTransfer.files[0]);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    if (e.type === "dragleave") setDragActive(false);
  };

  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);
          setTimeout(() => setShowProcessing(true), 600);
          return 100;
        }
        return p + 1.2;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [uploading]);

  return (
    <div className="space-y-6">
      <p className="text-sm font-medium">Upload File</p>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative w-full h-44 rounded-xl border-2 border-dashed bg-[#FAFAFA] flex items-center justify-center transition
        ${dragActive ? "border-[#182938]" : "border-[#BCC7D2]"}`}
      >
        {!file ? (
          <UploadIdle onFileSelect={startUpload} />
        ) : uploading ? (
          <UploadProgress fileName={file.name} progress={progress} />
        ) : uploadComplete ? (
          <>
            <UploadSuccess fileName={file.name} />
            <UploadActions
              onReupload={() => startUpload(file)}
              onDelete={handleDelete}
            />
          </>
        ) : null}
      </div>

      {/* Data Processing Under Upload Box */}
      {showProcessing && file && <DataProcessing fileName={file.name} />}
    </div>
  );
}
