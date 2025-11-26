import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import { useTheme } from "../theme";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
}: LogoutModalProps) {
  if (!isOpen) return null;
  const { theme } = useTheme();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[50] bg-black/30 backdrop-blur-sm"
    >
      <div
        className="rounded-xl shadow-lg p-8 min-w-[420px] max-w-[420px] text-center relative flex flex-col items-center justify-center"
        style={{ backgroundColor: theme.surface, color: theme.primaryText }}
      >
        {/* Cancel icon at top right */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 transition"
          aria-label="Close"
          style={{ color: theme.accent }}
        >
          <CancelIcon className="w-7 h-7" />
        </button>

        <WarningRoundedIcon sx={{ color: theme.accent, fontSize: 48 }} />

        <div className="my-4">
          <p className="text-base md:text-lg font-semibold tracking-tight" style={{ color: theme.primaryText }}>
            <span style={{ color: theme.primaryText }}>A</span>
            <span style={{ color: theme.accent }} className="font-bold">ii</span>
            <span style={{ color: theme.primaryText }}>nhome</span>
            <span className="px-1" style={{ color: theme.secondaryText }}>|</span>
            <span className="font-extrabold" style={{ color: theme.primaryText }}>IG</span>
          </p>
        </div>

        <p className="mb-6 font-extrabold" style={{ color: theme.primaryText }}>
          Are you sure you want to logout?
        </p>

        <div className="flex justify-center gap-4">
          <button
            style={{ borderColor: theme.accent, color: theme.primaryText }}
            className="h-8 w-15 border font-extrabold text-xs px-5 rounded-lg hover:text-white transition"
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = theme.accent}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
          >
            Yes
          </button>
          <button
            style={{ backgroundColor: theme.accent, borderColor: theme.accent, color: theme.primaryText }}
            className="h-8 w-15 border font-extrabold text-xs px-5 rounded-lg transition"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}
