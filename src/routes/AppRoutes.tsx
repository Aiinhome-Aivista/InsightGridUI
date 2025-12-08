import AppLayout from "../layout/AppLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../pages/Auth/AuthContext";
import Upload_page from "../pages/Uploads/Upload_page";
import Dashboard_page from "../pages/Dashboard/QueryDesigner";
import Setting_page from "../pages/Setting/Setting_page";
import Download_page from "../pages/Download/Download_page";
import Customize_page from "../pages/Customize/Customize_page";
import Login from "../pages/Auth/Login";
import LandingPage from "../pages/LandingPage/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import QueryDesigner from "../pages/Dashboard/QueryDesigner";

function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<PublicRoute component={LandingPage} />} />
        <Route path="/login" element={<PublicRoute component={Login} />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/layout" element={<AppLayout />}>
            <Route index element={<Navigate to="upload" replace />} />
            <Route path="upload" element={<Upload_page />} />
            <Route path="query-designer" element={<QueryDesigner />} />
            <Route path="setting" element={<Setting_page />} />
            <Route path="download" element={<Download_page />} />
            <Route path="customize" element={<Customize_page />} />
  
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

const PublicRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/layout/upload" replace /> : <Component />;
};

export default AppRoutes;
