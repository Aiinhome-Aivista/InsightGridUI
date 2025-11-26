export default function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-3 py-2 cursor-pointer hover:bg-gray-50 px-2 rounded transition-colors select-none">
      
      <span
        className={`
          w-4 h-4 flex items-center justify-center rounded border 
          cursor-pointer transition
          ${checked ? "bg-gray-500 border-gray-500" : "border-gray-400 bg-white"}
        `}
        onClick={onChange}
      >
        {checked && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="M20 6L9 17l-5-5"></path>
          </svg>
        )}
      </span>

      <span className="text-sm text-gray-700">{label}</span>
    </label>
  );
}
