interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: any;
  error?: string;
  disabled?: boolean;
}

export default function FileNameInput({ value, onChange, theme, error, disabled = false }: Props) {
  return (
    <div className="mb-5">
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: theme.primaryText }}
      >
        Session Name <span style={{ color: '#EF4444' }}>*</span>
      </label>

      <input
        type="text"
        placeholder="Enter session name (required)"
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          backgroundColor: theme.surface,
          color: theme.primaryText,
          borderColor: error ? '#EF4444' : theme.border,
          '--tw-ring-color': error ? '#EF4444' : theme.accent,
        } as React.CSSProperties}
      />
      
      {error && (
        <p className="text-xs mt-1" style={{ color: '#EF4444' }}>
          {error}
        </p>
      )}
    </div>
  );
}