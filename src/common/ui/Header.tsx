import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../theme";

export default function Header() {
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const weekday = now.toLocaleDateString('en-US', { weekday: 'long' });
      const day = now.getDate();
      const month = now.toLocaleDateString('en-US', { month: 'long' });
      const dateString = `${weekday} | ${day}${getOrdinalSuffix(day)} ${month}`;
      const timeString = now.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      setFormattedDate(dateString);
      setFormattedTime(timeString);
    };

    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const { theme } = useTheme();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header
      className="flex justify-between items-center px-6 h-14 border-b shadow-sm"
      style={{
        backgroundColor: theme.surface,
        borderColor: theme.border,
        color: theme.primaryText,
      }}
    >
      <div className="flex justify-between items-center w-full">
        {/* Left Logo Section */}
        <div className="flex items-center">
          <p className="text-base md:text-lg font-semibold tracking-tight" style={{ color: theme.primaryText }}>
            <span style={{ color: theme.primaryText }}>A</span>
            <span style={{ color: theme.accent }} className="font-bold">
              ii
            </span>
            <span style={{ color: theme.primaryText }}>nhome</span>
            <span className="px-1" style={{ color: theme.secondaryText }}>
              |
            </span>
            <span className="font-extrabold" style={{ color: theme.primaryText }}>
              IG
            </span>
          </p>
        </div>

        {/* Right Date & Time Section */}
        <div className="flex items-center gap-3 text-sm" style={{ color: theme.secondaryText }}>
          <p>
            {formattedDate} | {formattedTime}
          </p>
          <Tooltip title="Logout" arrow>
            <LogoutRoundedIcon
              onClick={handleLogout}
              sx={{
                color: theme.secondaryText,
                fontSize: "20px",
                cursor: "pointer",
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: theme.primaryText,
                },
              }}
            />
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
