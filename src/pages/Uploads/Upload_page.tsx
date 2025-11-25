import { useState } from "react";
import { useTheme } from "../../theme";
import FileDropZone from "./components/FileDropZone";
import DataProcessing from "./components/DataProcessing";

export default function UploadPage() {
  const { theme } = useTheme();
  const [processedFiles, setProcessedFiles] = useState<File[]>([]);

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
        <FileDropZone
          onUploadComplete={(files) => setProcessedFiles(files)}
          theme={theme}
        />
        {/* Data Processing Under Upload Box */}
        {processedFiles.length > 0 && <DataProcessing files={processedFiles} />}
      </div>
    </div>
  );
}
