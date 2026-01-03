const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GET_APIS = {
  
};

export const POST_APIS = {
  login: `${BASE_URL}company/login`,
  super_admin_login: `${BASE_URL}superadmin/login`,
  // fileUpload: `${BASE_URL}upload_files`,
  fileUpload: `${BASE_URL}upload_files_new`,
  tracker: `${BASE_URL}get_file_status`,
  chat_ai: `${BASE_URL}chat_ai`,
  execute_sql: `${BASE_URL}execute_sql`,
  // get_ui_data: `${BASE_URL}get_ui_data`,
  processSessionData: `${BASE_URL}process_session_data`,
  get_dashboard_data: `${BASE_URL}get_dashboard_data`,
  save_chat: `${BASE_URL}query_save`,
  // get_chat_history: `${BASE_URL}get_uploaded_table_with_tabledata`,
  get_table_data: `${BASE_URL}get_full_table_info`,
  get_saved_query_response: `${BASE_URL}get_saved_query_response`,
  get_report_list:`${BASE_URL}report_list`,
  report_save: `${BASE_URL}report_save`,
  delete_uploaded_file: `${BASE_URL}delete_uploaded_file`,
};