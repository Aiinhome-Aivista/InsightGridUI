import AppLayout from "../layout/AppLayout";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../pages/Auth/AuthContext";
import Upload_page from "../pages/Uploads/Upload_page";
import Customize_page from "../pages/Customize/Customize_page";
import Login from "../pages/Auth/Login";
import LandingPage from "../pages/LandingPage/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import QueryDesigner from "../pages/Dashboard/DataDoctorParent";
import ShowQuery from "../pages/Dashboard/ShowQuery";
import ReportDesignerManage from "../pages/report-designer/ReportDesigneerManage";
import Dashboard from "../pages/Dashboard/Components/Dashboard";
import ReportDesignerParents from "../pages/report-designer/ReportDesignerParents";
import ReportSchedulerManage from "../pages/report-scheduler/ReportSchedulerManage";
import Settings from "../pages/Setting/Setting";
function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
         <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/layout" element={<AppLayout />}>
            <Route index element={<Navigate to="upload" replace />} />
            <Route path="upload" element={<Upload_page />} />
            <Route path="query-list" element={<ShowQuery />} />
            <Route path="report-designer" element={<ReportDesignerManage />} />
            <Route path="report-scheduler" element={<ReportSchedulerManage />} />
            <Route path="report-designer-view" element={<ReportDesignerParents />} />
            <Route path="query-designer" element={<QueryDesigner />} />
              <Route path="Customize" element={<Settings />} />
            {/* <Route path="customize" element={<Customize_page />} /> */}
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

const RootRoute = () => {
  const { isAuthenticated } = useAuth();
  // If authenticated, redirect to the main dashboard/upload page. Otherwise, show the landing page.
  return isAuthenticated ? <Navigate to="/layout/upload" replace /> : <LandingPage />;
};

const PublicRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/layout/upload";

  // This component should only prevent authenticated users from seeing the login page.
  const isLoginPage = location.pathname === '/login';
  return isAuthenticated && isLoginPage ? <Navigate to={from} replace /> : <Component />;
};

export default AppRoutes;
