interface Props {
  onReupload: () => void;
  onDelete: () => void;
}

export default function UploadActions({ onReupload, onDelete }: Props) {
  return (
    <div className="absolute right-4 bottom-4 flex flex-col items-end gap-2">
      <button
        onClick={onReupload}
        className="flex items-center gap-3 bg-[#D9D9D9] hover:bg-[#D0D0D0] px-3 py-2 rounded-lg"
      >
        <span className="text-xs text-[#5F6368] font-medium">Re-upload</span>
        <img src="/src/assets/reupload.svg" className="w-4 h-4" />
      </button>

      <button
        onClick={onDelete}
        className="p-1 hover:opacity-70"
        title="Delete"
      >
        <img src="/src/assets/delete.svg" className="w-4 h-4" />
      </button>
    </div>
  );
}
