import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useState, useEffect } from "react";
import Tooltip from '@mui/material/Tooltip';

export default function Header() {
  const [formattedDate, setFormattedDate] = useState('');
  const [formattedTime, setFormattedTime] = useState('');

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

  return (
    <header className="flex justify-between items-center bg-white px-6 h-14 border-b border-[#E0E4E9] shadow-sm">
      <div className="flex justify-between items-center w-full">
        {/* Left Logo Section */}
        <div className="flex items-center">
          <p className="text-base md:text-lg text-[#2C2E42] font-semibold tracking-tight">
            <span className="text-[#2C2E42]">A</span>
            <span className="text-[#3A37FF] font-bold">ii</span>
            <span className="text-[#2C2E42]">nhome</span>
            <span className="px-1 text-[#7E8489]">|</span>
            <span className="font-extrabold text-[#2C2E42]">IG</span>
          </p>
        </div>

        {/* Right Date & Time Section */}
        <div className="flex items-center gap-3 text-sm text-[#7E8489]">
          <p>
            {formattedDate} | {formattedTime}
          </p>
          <Tooltip title="Logout" arrow>
            <LogoutRoundedIcon
              sx={{
                color: "#7E8489",
                fontSize: "20px",
                cursor: "pointer",
                transition: "color 0.2s ease-in-out",
                "&:hover": {
                  color: "#4a4e51ff",
                },
              }}
            />
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
