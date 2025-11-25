import { useState, type DragEvent, type ChangeEvent, useEffect } from "react";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";
import DataProcessing from "./DataProcessing";

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
  const [showProcessing, setShowProcessing] = useState(false);

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
    if (e.dataTransfer.files?.[0]) startUpload(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) startUpload(e.target.files[0]);
  };

  const startUpload = (selectedFile: File) => {
    setFile(selectedFile);
    setUploading(true);
    setProgress(0);
    setUploadComplete(false);
    setShowProcessing(false);
  };

  const handleReupload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xls,.xlsx,.pdf";
    input.onchange = (e: any) => {
      if (e.target.files?.[0]) startUpload(e.target.files[0]);
    };
    input.click();
  };

  const handleDelete = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setUploadComplete(false);
    setShowProcessing(false);
  };

  useEffect(() => {
    if (!uploading) return;

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadComplete(true);

          // show processing UI after upload
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
        {/* Center Content */}
        {!file || (!uploading && !uploadComplete) ? (
          <div className="flex flex-col items-center text-center">
            <BackupOutlinedIcon className="w-10 h-10 text-[#7E8489]" />

            <p className="text-sm mt-2 text-[#6A7077]">
              Click to upload or drag and drop <br />
              CSV, EXC, PDF (MAX 10MB)
            </p>

            <label className="mt-3 cursor-pointer">
              <input type="file" onChange={handleFileChange} className="hidden" />
              <span className="text-sm px-4 py-2 rounded-md bg-white text-[#333] border">
                Or Select a File
              </span>
            </label>
          </div>
        ) : uploading ? (
          // Uploading UI
          <div className="flex flex-col items-center">
            <BackupOutlinedIcon className="w-8 h-8 text-gray-500 mb-2" />
            <p className="text-sm text-gray-600">{file?.name}</p>

            <div className="w-64 h-1 bg-gray-300 rounded mt-3 overflow-hidden">
              <div
                className="h-full bg-gray-600 transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            <p className="text-xs mt-2 text-gray-500">Uploading...</p>
          </div>
        ) : (
          uploadComplete && (
            // Uploaded UI
            <div className="flex flex-col items-center">
              <BackupOutlinedIcon className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-sm text-gray-700">{file?.name}</p>

              <div className="w-64 h-1 bg-gray-300 rounded mt-3 overflow-hidden">
                <div className="h-full bg-gray-600 w-full"></div>
              </div>

              <p className="text-xs mt-2 text-gray-700 font-semibold">Uploaded</p>
            </div>
          )
        )}

        {/* Right-side (Re-upload + Delete) */}
        {uploadComplete && (
          <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
            <button
              onClick={handleReupload}
              className="flex items-center gap-3 bg-[#D9D9D9] hover:bg-[#D0D0D0] px-3 py-2 rounded-lg"
            >
              <span className="text-xs text-[#5F6368] font-medium">Re-upload</span>
              <img src="/src/assets/reupload.svg" className="w-4 h-4" />
            </button>

            <button
              onClick={handleDelete}
              className="p-1 hover:opacity-70"
              title="Delete"
            >
              <img src="/src/assets/deleteIcon.svg" className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* DataProcessing (show after upload completes) */}
      {showProcessing && file && (
        <DataProcessing fileName={file.name} />
      )}
    </div>
  );
}
