import BackupOutlinedIcon from "@mui/icons-material/BackupOutlined";

interface Props {
  onFileSelect: (files: File[]) => void;
}

export default function UploadIdle({ onFileSelect }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) onFileSelect(Array.from(e.target.files));
  };

  return (
    <div className="flex flex-col items-center text-center">
      <BackupOutlinedIcon className="w-10 h-10 text-[#7E8489]" />

      <p className="text-sm mt-2 text-[#6A7077]">
        Click to upload or drag and drop <br />
        CSV, EXC, PDF (MAX 10MB)
      </p>

      <label className="mt-3 cursor-pointer">
        <input type="file" onChange={handleChange} className="hidden" multiple />
        <span className="text-sm px-4 py-2 rounded-md bg-white text-[#333] border">
          Or Select a File
        </span>
      </label>
    </div>
  );
}
