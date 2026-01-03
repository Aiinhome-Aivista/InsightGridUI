import axios from "axios";
import { GET_APIS, POST_APIS } from "../../connection";
class ApiServices {
  login(body) {
    return axios.post(POST_APIS.login, body);
  }

  superAdminLogin(body) {
    return axios.post(POST_APIS.super_admin_login, body);
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

  tracker(body) {
    return axios.post(POST_APIS.tracker, body);
  }


  getDashboardData(body) {
    return axios.post(POST_APIS.get_dashboard_data, body);
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

}

export default new ApiServices();
