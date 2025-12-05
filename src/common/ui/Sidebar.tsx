import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import type { LoginUserData } from "../../models/login.model";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import ViewColumnRoundedIcon from '@mui/icons-material/ViewColumnRounded';
import { useTheme } from "../../theme";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

const menuItems = [
  { name: "Home", icon: HomeOutlinedIcon, path: "dashboard-component" },
  { name: "Upload", icon: FileUploadOutlinedIcon, path: "upload" },
  { name: "Table Insights", icon: ViewColumnRoundedIcon, path: "dashboard" },
  { name: "Graph Insights", icon: GridViewRoundedIcon, path: "table" },
  { name: "Setting", icon: SettingsRoundedIcon, path: "setting" },
  { name: "Download", icon: FileDownloadOutlinedIcon, path: "download" },
  { name: "Customize", icon: TuneOutlinedIcon, path: "customize" },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const [user, setUser] = useState<LoginUserData | null>(null);
  const { theme } = useTheme();
  const location = useLocation();
  const activePath = location.pathname.split("/").pop() || "upload";

  useEffect(() => {
    const userDataString = localStorage.getItem("ig_user");
    if (userDataString) {
      try {
        setUser(JSON.parse(userDataString));
      } catch (error) { console.error("Failed to parse user data from localStorage", error); }
    }
  }, []);
  return (
    <aside
      className={`${collapsed ? "w-20" : "w-60"
        } h-screen border-r flex flex-col transition-all duration-200`}
      style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.primaryText }}
    >
      {/* Header */}
      <div
        className={`flex items-center border-b border-[#BCC7D2] h-14 ${collapsed ? "px-3 justify-center" : "px-4"
          }`}
        style={{ borderColor: theme.border }}
      >
        <AccountCircleRoundedIcon sx={{ color: theme.secondaryText, fontSize: "2rem" }} />

        {!collapsed && (
          <p className="ml-3 font-medium" style={{ color: theme.primaryText }}>
            {user?.user_name || "User"}
          </p>
        )}

        <button
          type="button"
          className={`ml-auto ${collapsed ? "" : "ml-4"}`}
          style={{ color: theme.secondaryText }}
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ArrowForwardIosRoundedIcon sx={{ fontSize: "small", color: theme.secondaryText }} />
          ) : (
            <ArrowBackIosNewRoundedIcon sx={{ fontSize: "small", color: theme.secondaryText }} />
          )}
        </button>
      </div>

      {/* Menu Items */}
      <div className="mt-3 flex-1">
        <nav className="flex flex-col gap-1 px-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === activePath;
            return (
              <Link to={item.path} key={item.name} className="no-underline">
                <div
                  className={`flex items-center ${collapsed ? "justify-center" : "justify-start"
                    } h-12 cursor-pointer rounded-lg transition px-3`}
                  style={{
                    backgroundColor: isActive ? theme.accent : "transparent",
                    color: isActive ? theme.background : theme.primaryText,
                    border: isActive ? `1px solid ${theme.accent}` : "1px solid transparent",
                  }}
                >
                  <Icon
                    sx={{
                      color: isActive ? theme.background : theme.primaryText,
                      fontSize: "1.1rem",
                    }}
                  />
                  {!collapsed && (
                    <span className="ml-3 text-sm font-medium capitalize">
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
