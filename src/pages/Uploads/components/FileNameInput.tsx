interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: any;
}

export default function FileNameInput({ value, onChange, theme }: Props) {
  return (
    <div className="mb-5">
      <label
        className="block text-sm font-medium mb-1"
        style={{ color: theme.primaryText }}
      >
        File Name
      </label>

      <input
        type="text"
        placeholder="Write your file name"
        value={value}
        onChange={onChange}
        className="w-full border rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2"
        style={{
          backgroundColor: theme.surface,
          color: theme.primaryText,
          borderColor: theme.border,
          '--tw-ring-color': theme.accent,
        } as React.CSSProperties}
      />
    </div>
  );
}
