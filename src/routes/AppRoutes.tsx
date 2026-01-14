import AppLayout from "../layout/AppLayout";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "../pages/Auth/AuthContext";
import Upload_page from "../pages/Uploads/Upload_page";
import Login from "../pages/Auth/Login";
import LandingPage from "../pages/LandingPage/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import QueryDesigner from "../pages/query-designer/QueryDesignerParent";
import ShowQuery from "../pages/query-designer/QueryDesignerManage";
import ReportDesignerManage from "../pages/report-designer/ReportDesigneerManage";
import Dashboard from "../pages/Dashboard/Components/Dashboard";
import ReportDesignerParents from "../pages/report-designer/ReportDesignerParents";
import ReportSchedulerManage from "../pages/report-scheduler/ReportSchedulerManage";
import ReportSchedulerForm from "../pages/report-scheduler/report-scheduler-form";
import Settings from "../pages/Setting/Setting";
import ManageCompanyUsers from "../pages/company-users/ManageCompanyUsers";
import ManageSuperAdminDashboard from "../pages/Superadmin/ManageSuperAdminDashboard";
import ManageCompanies from "../pages/Superadmin/ManageCompanies";
import RegisterCompany from "../pages/Superadmin/RegisterCompany";
import Pricing from "../pages/LandingPage/components/Pricing";
import Resources from "../pages/LandingPage/components/Resources";
import Faq from "../pages/LandingPage/components/Faq";
import AddCompanyUser from "../pages/company-users/Components/AddCompanyUser";
import ManageCompanyAdmin from "../pages/Superadmin/ManageCompanyAdmin";
import AddCompanyAdmin from "../pages/Superadmin/AddCompanyAdmin";
function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/login" element={<Login />} /> */}
        <Route path="/login" element={<Navigate to="/login/user" replace />} />
        <Route path="/login/super-admin" element={<Login />} />
        <Route path="/login/company-admin" element={<Login />} />
        <Route path="/login/user" element={<Login />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/resources" element={<Resources />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/layout" element={<AppLayout />}>
            <Route index element={<Navigate to="upload" replace />} />
            <Route path="upload" element={<Upload_page />} />
            <Route path="query-list" element={<ShowQuery />} />
            <Route path="report-designer" element={<ReportDesignerManage />} />
            <Route path="report-scheduler" element={<ReportSchedulerManage />} />
            <Route path="report-scheduler-form" element={<ReportSchedulerForm />} />
            <Route path="report-designer-view" element={<ReportDesignerParents />} />
            <Route path="query-designer" element={<QueryDesigner />} />
            <Route path="Settings" element={<Settings />} />
            {/* <Route path="customize" element={<Customize_page />} /> */}
            <Route path="dashboard" element={<Dashboard />} />
            {/* <Route path="manage-company-users" element={<ManageCompanyUsers />} />
            <Route path="add-company-user" element={<AddCompanyUser />} />
            <Route path="add-company-user/:id" element={<AddCompanyUser />} /> */}

            {/* super admin routes */}
            {/* <Route path="super-dashboard" element={<ManageSuperAdminDashboard />} />
            <Route path="manage-companies" element={<ManageCompanies />} />
            <Route path="register-company" element={<RegisterCompany />} />
            <Route path="register-company/:id" element={<RegisterCompany />} />
            <Route path="manage-company-admin" element={<ManageCompanyAdmin />} />
            <Route path="add-company-admin" element={<AddCompanyAdmin />} />
            <Route path="add-company-admin/:id" element={<AddCompanyAdmin />} /> */}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

const RootRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/layout/upload" replace /> : <LandingPage />;
};

const PublicRoute = ({ component: Component }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/layout/upload";
  const isLoginPage = location.pathname === '/login';
  return isAuthenticated && isLoginPage ? <Navigate to={from} replace /> : <Component />;
};

export default AppRoutes;
