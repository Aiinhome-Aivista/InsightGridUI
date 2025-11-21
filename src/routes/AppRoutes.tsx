import AppLayout from "../layout/AppLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Upload_page from "../pages/Upload_page";
import Dashboard_page from "../pages/Dashboard_page";
import Setting_page from "../pages/Setting_page";
import Download_page from "../pages/Download_page";
import Customize_page from "../pages/Customize_page";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Navigate to="/upload" replace />} />
        <Route path="upload" element={<Upload_page />} />
        <Route path="dashboard" element={<Dashboard_page />} />
        <Route path="setting" element={<Setting_page />} />
        <Route path="download" element={<Download_page />} />
        <Route path="customize" element={<Customize_page />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
