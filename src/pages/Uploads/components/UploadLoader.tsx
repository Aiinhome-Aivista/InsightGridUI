import React from "react";

interface Props {
  fileName: string | undefined;
  progress: number;
}

export default function UploadLoader({ fileName, progress }: Props) {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="text-gray-700 text-sm mb-1 font-medium">
        {fileName}
      </div>

      <div className="w-[55%] h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-xs mt-2 text-gray-600 font-semibold">Uploading</p>
    </div>
  );
}
