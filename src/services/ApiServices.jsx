import axios from "axios";
import { GET_APIS, POST_APIS } from "../../connection";

/* ===============================
   AXIOS TOKEN INTERCEPTOR
   token will be read from ig_user
================================ */

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ig_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear ALL auth data on any 401
      localStorage.removeItem("ig_user");
      localStorage.removeItem("ig_token");

      // Force redirect to login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

class ApiServices {
  login(body) {
    return axios.post(POST_APIS.login, body);
  }

  getUiData(body) {
    return axios.post(POST_APIS.get_ui_data, body);
  }
  chat(body) {
    return axios.post(POST_APIS.chat_ai, body);
  }

  executeSql(body) {
    return axios.post(POST_APIS.execute_sql, body);
  }

  // For file upload (FormData)
  fileUpload(formData) {
    return axios.post(POST_APIS.fileUpload, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  // For preview (JSON)
  preview(payload) {
    return axios.post(POST_APIS.fileUpload, payload, {
      headers: { "Content-Type": "application/json" }
    });
  }


  processSessionData(body) {
    return axios.post(POST_APIS.processSessionData, body);
  }

  saveChat(body) {
    return axios.post(POST_APIS.save_chat, body);
  }

  tracker() {
    return axios.post(POST_APIS.tracker, {});
  }


  getDashboardData() {
    return axios.post(POST_APIS.get_dashboard_data, {});
  }

  getChatHistory(body) {
    return axios.post(POST_APIS.get_chat_history, body);
  }

  getSavedQueryResponse(body) {
    return axios.post(POST_APIS.get_saved_query_response, body);
  }

  getTableData(body) {
    return axios.post(POST_APIS.get_table_data, body);
  }
  getReportList(body) {
    return axios.post(POST_APIS.get_report_list, body);
  }

  report_save(body) {
    return axios.post(POST_APIS.report_save, body);
  }

  deleteUploadedFile(body) {
    return axios.post(POST_APIS.delete_uploaded_file, body);
  }


  getUploadProgress(body) {
    return axios.post(POST_APIS.upload_progress, body);
  }
  superAdminLogin(body) {
    return axios.post(POST_APIS.super_admin_login, body);
  }
  getAllCompanies() {
    return axios.get(GET_APIS.get_all_companies);
  }
  adminCompanyDelete(body) {
    return axios.post(POST_APIS.admin_company_delete, body);
  }
  modifyChart(body) {
    return axios.post(POST_APIS.modify_chart, body);
  }
}

export default new ApiServices();
