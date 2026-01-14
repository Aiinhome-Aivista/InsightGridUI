import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import type { LoginUserData } from "../../models/login.model";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useTheme } from "../../theme";
import ApiServices from "../../services/ApiServices";
import DataObjectRoundedIcon from '@mui/icons-material/DataObjectRounded';
import "../../styles/tippy-theme.css";
import { useAuth } from "../../pages/Auth/AuthContext";
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import HourglassTopTwoToneIcon from '@mui/icons-material/HourglassTopTwoTone';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import person_add from '@mui/icons-material/PersonAdd';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
const menuItems = [
  { name: "Super Dashboard", icon: SpaceDashboardIcon, path: "super-dashboard", roles: ["superadmin"], },
  { name: "Company", icon: ApartmentIcon, path: "manage-companies", roles: ["superadmin"], },
  { name: "Dashboard", icon: DashboardRoundedIcon, path: "dashboard", roles: ["companyadmin", "user"] },
  { name: "User", icon: person_add, path: "manage-company-users", roles: ["companyadmin"] },
  { name: "Upload", icon: FileUploadOutlinedIcon, path: "upload", roles: ["companyadmin", "user"] },
  { name: "Query Designer", icon: DataObjectRoundedIcon, path: "query-list", roles: ["companyadmin", "user"] },
  { name: "Report Designer", icon: SummarizeOutlinedIcon, path: "report-designer", roles: ["companyadmin", "user"] },
  // { name: "Report Scheduler", icon: HourglassTopTwoToneIcon , path: "report-scheduler" , roles: ["companyadmin", "user"] },
  { name: "Settings", icon: SettingsRoundedIcon, path: "Settings", roles: ["companyadmin", "user"] },
  //  { name: "Customize", icon: TuneOutlinedIcon, path: "customize" },
  { name: "Company Admin", icon: LogoutRoundedIcon, path: "manage-company-admin", roles: ["superadmin"] },
  

];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(true);
  const { theme } = useTheme();
  const location = useLocation();
  const activePath = location.pathname.split("/").pop();
  const { user, setIsLogoutModalOpen } = useAuth();

  const handleTabClick = async (item) => {

    if (item.path === "table-insights") {
      const userData = JSON.parse(localStorage.getItem("ig_user") || "{}");
      const createdBy = userData?.user_id;

      if (!createdBy) {
        console.error("User ID missing in localStorage");
        return;
      }

      try {
        await ApiServices.tracker({ created_by: createdBy });
        console.log("Tracker API Success");
      } catch (err) {
        console.error("Tracker API Failed:", err);
      }
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };

  return (
    <aside
      className={`${collapsed ? "w-20" : "w-60"} 
  h-full border-r shrink-0 transition-all duration-200`}
      style={{ backgroundColor: theme.surface, borderColor: theme.border, color: theme.primaryText }}
    >
      <div
        className={`flex items-center border-b border-[#BCC7D2] h-14 ${collapsed ? "px-3 justify-center" : "px-4"
          }`}
        style={{ borderColor: theme.border }}
      >
        <Tippy
          content={user?.full_name || "User"}
          placement="right"
          theme="gray"
          disabled={!collapsed}
        >
          <div className="flex items-center">
            <AccountCircleRoundedIcon sx={{ color: theme.secondaryText, fontSize: "2rem" }} />
            {!collapsed && (
              <p className="ml-3 font-medium" style={{ color: theme.primaryText }}>
                {user?.full_name || "User"}
              </p>
            )}
          </div>
        </Tippy>

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
      <div className="mt-3 flex-1">
        <nav className={`flex flex-col gap-2 ${collapsed ? 'px-4' : 'px-2'}`}>
          {menuItems.filter(item => item.roles.includes(user?.role)).map((item) => {
            const Icon = item.icon;
            let isActive = item.path === activePath;
            if (item.path === 'query-list' && activePath === 'query-designer') {
              isActive = true;
            }
            if (item.path === 'report-designer' && activePath === 'report-designer-view') {
              isActive = true;
            }
            return (
              <Tippy
                content={item.name}
                placement="right"
                theme="gray"
                disabled={!collapsed}
                key={item.name}
              >
                <Link to={item.path} className="no-underline" onClick={() => handleTabClick(item)}>
                  <div
                    className={`flex items-center ${collapsed ? 'justify-center w-12 h-12' : 'justify-start h-12 px-3'
                      } cursor-pointer rounded-lg transition-colors duration-200 ${isActive ? '' : ''
                      } `}
                    style={{
                      backgroundColor: isActive ? theme.accent : undefined,
                      color: isActive ? theme.background : theme.primaryText,
                      border: isActive ? `1px solid ${theme.accent}` : "1px solid transparent",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = `${theme.accent}33`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
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
              </Tippy>
            );
          })}
        </nav>
      </div>
      <div className={`py-4 ${collapsed ? 'px-4' : 'px-3'}`} style={{ borderColor: theme.border }}>
        <Tippy
          content="Logout"
          placement="right"
          theme="gray"
          disabled={!collapsed}
        >
          <div
            onClick={handleLogout}
            className={`flex items-center cursor-pointer rounded-lg transition-colors duration-200 ${collapsed ? 'justify-center w-12 h-12' : 'justify-start h-12 px-3'}`}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${theme.accent}33`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <LogoutRoundedIcon
              sx={{
                color: theme.secondaryText,
                fontSize: "1.2rem",
              }}
            />
            {!collapsed && <span className="ml-3 text-sm font-medium" style={{ color: theme.secondaryText }}>Logout</span>}
          </div>
        </Tippy>
      </div>
    </aside>
  );
}