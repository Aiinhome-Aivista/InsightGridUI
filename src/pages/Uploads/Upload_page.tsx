import { useState } from "react";
import { useTheme } from "../../theme";
import FileNameInput from "./components/FileNameInput";
import FileDropZone from "./components/FileDropZone";

export default function UploadPage() {
  const { theme } = useTheme();
  const [fileName, setFileName] = useState("");
  const [file, setFile] = useState<File | null>(null);

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
          className="text-center text-sm mb-6"
          style={{ color: theme.secondaryText }}
        >
          Start by uploading a data file to create your first view.
        </p>

        {/* File Name Input Component */}
        <FileNameInput
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          theme={theme}
        />
        <FileDropZone file={file} setFile={setFile} theme={theme} />
      </div>
    </div>
  );
}
