import { useState } from "react";
import { Link } from "react-router-dom";
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';

const menuItems = [
  { name: "Upload", icon: FileUploadOutlinedIcon, path: "/upload" },
  { name: "Dashboard", icon: GridViewRoundedIcon, path: "/dashboard" },
  { name: "Setting", icon: SettingsRoundedIcon, path: "/setting" },
  { name: "Download", icon: FileDownloadOutlinedIcon, path: "/download" },
  { name: "Customize", icon: TuneOutlinedIcon, path: "/customize" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeItem, setActiveItem] = useState("Upload");

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-60"
      } bg-white h-screen border-r border-[#BCC7D2] flex flex-col transition-all duration-200`}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-[#BCC7D2] h-14 ${
          collapsed ? "px-3 justify-center" : "px-4"
        }`}
      >
        <AccountCircleRoundedIcon sx={{ color: "#BCC7D2", fontSize: "2rem" }} />

        {!collapsed && (
          <p className="ml-3 font-medium text-[#2C2E42]">User</p>
        )}

        <button
          className={`ml-auto text-gray-400 hover:text-gray-800 ${
            collapsed ? "" : "ml-4"
          }`}
          onClick={() => setCollapsed((c) => !c)}
        >
          {collapsed ? (
            <ArrowForwardIosRoundedIcon sx={{ fontSize: "small", color: "#8F96A9" }} />
          ) : (
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: "small", color: "#8F96A9" }} />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="mt-3 flex-1">
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.name === activeItem;
            return (
              <Link to={item.path} key={item.name} className="no-underline">
                <div
                  onClick={() => setActiveItem(item.name)}
                  className={`flex items-center ${
                    collapsed ? "justify-center" : "justify-start"
                  } h-12 cursor-pointer rounded-lg transition px-3 ${isActive ? "bg-[#182938]/10" : "hover:bg-[#182938]/10"}`}
                >
                  <Icon sx={{ color: "#182938", fontSize: "1.5rem" }} />
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium text-[#2C2E42] capitalize">
                      {item.name}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
