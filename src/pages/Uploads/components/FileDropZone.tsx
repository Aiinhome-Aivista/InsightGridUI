import { useState, type DragEvent, type ChangeEvent } from "react";
import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";

interface Props {
  file: File | null;
  setFile: (file: File | null) => void;
  theme: any;
}

export default function FileDropZone({ file, setFile, theme }: Props) {
  const [dragActive, setDragActive] = useState(false);

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
    if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

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
        className={`flex flex-col items-center justify-center w-full h-44 rounded-lg 
          border-2 border-dashed transition 
          ${dragActive ? "border-[#182938]" : "border-[#BCC7D2]"} bg-[#FAFAFA]`}
      >
        <BackupOutlinedIcon className="w-15 h-15 text-[#7E8489] mb-2" />

        <p className="text-sm text-center" style={{ color: theme.secondaryText }}>
          Click to upload or drag and drop <br /> CSV, EXC, PDF (MAX 10MB)
        </p>

        <label className="mt-3">
          <input type="file" onChange={handleFileChange} className="hidden" />
          <span
            className="cursor-pointer text-sm font-medium px-4 py-2 rounded-md"
            style={{ color: theme.primaryText, backgroundColor: theme.surface }}
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
      </div>
    </div>
  );
}
