import  { useState, type DragEvent, type ChangeEvent } from 'react';
export default function Upload_page() {
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="flex flex-col items-start w-full h-full bg-white p-8 ">
      <div className="w-full bg-white rounded-lg">
        <h2 className="text-center text-xl font-semibold text-[#2C2E42]">
          Upload your data
        </h2>
        <p className="text-center text-sm text-[#7E8489] mb-6">
          Start by uploading a data file to create your first view.
        </p>

        {/* File Name Input */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-[#2C2E42] mb-1">
            File Name
          </label>
          <input
            type="text"
            placeholder="Write your file name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="w-full border border-[#E0E4E9] rounded-md px-4 py-2 text-sm text-[#2C2E42] focus:outline-none focus:ring-2 focus:ring-[#BCC7D2]"
          />
        </div>

        {/* Upload File Section */}
        <div>
          <label className="block text-sm font-medium text-[#2C2E42] mb-2">
            Upload File
          </label>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center w-full h-44 rounded-lg border-2 border-dashed transition ${
              dragActive ? 'border-[#182938]' : 'border-[#BCC7D2]'
            } bg-[#FAFAFA]`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-10 h-10 text-[#7E8489] mb-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v12"
              />
            </svg>

            <p className="text-sm text-[#7E8489] text-center">
              Click to upload or drag and drop <br /> CSV, EXC, PDF (MAX 10MB)
            </p>

            <label className="mt-3">
              <input type="file" onChange={handleFileChange} className="hidden" />
              <span className="cursor-pointer bg-[#E0E4E9] text-[#2C2E42] text-sm font-medium px-4 py-2 rounded-md">
                Or Select a File
              </span>
            </label>

            {file && (
              <p className="text-xs text-[#7E8489] mt-2">
                Selected file: <span className="font-semibold">{file.name}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
