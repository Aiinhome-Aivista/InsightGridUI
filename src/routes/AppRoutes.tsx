import AppLayout from "../layout/AppLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import Upload_page from "../pages/Uploads/Upload_page";
import Dashboard_page from "../pages/Dashboard/Dashboard_page";
import Setting_page from "../pages/Setting/Setting_page";
import Download_page from "../pages/Download/Download_page";
import Customize_page from "../pages/Customize/Customize_page";
import Login from "../pages/Auth/Login";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />}/>
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
