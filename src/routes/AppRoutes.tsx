// ...existing code...
import AppLayout from "../layout/AppLayout";
import { Routes, Route, Navigate } from "react-router-dom";

import Upload_page from "../pages/Uploads/Upload_page";
import Dashboard_page from "../pages/Dashboard/Dashboard_page";
import Setting_page from "../pages/Setting/Setting_page";
import Download_page from "../pages/Download/Download_page";
import Customize_page from "../pages/Customize/Customize_page";
import Login from "../pages/Auth/Login";

// New pages
import SQL_page from "../pages/Filters/SQL_page";
import Filter_page from "../pages/Filters/Filter_page";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      {/* optional top-level redirects */}
      <Route path="/upload" element={<Navigate to="/layout/upload" replace />} />
      <Route path="/dashboard" element={<Navigate to="/layout/dashboard" replace />} />
      <Route path="/setting" element={<Navigate to="/layout/setting" replace />} />
      <Route path="/download" element={<Navigate to="/layout/download" replace />} />
      <Route path="/customize" element={<Navigate to="/layout/customize" replace />} />

      <Route path="/layout" element={<AppLayout />}>
        {/* Default page */}
        <Route index element={<Navigate to="upload" replace />} />

        <Route path="upload" element={<Upload_page />} />
        <Route path="dashboard" element={<Dashboard_page />} />
        <Route path="setting" element={<Setting_page />} />
        <Route path="download" element={<Download_page />} />
        <Route path="customize" element={<Customize_page />} />

        {/* ✅ Newly added routes */}
        <Route path="sql" element={<SQL_page />} />
        <Route path="filter" element={<Filter_page />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
