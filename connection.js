const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GET_APIS = {
  tracker: `${BASE_URL}tracker`,
};

export const POST_APIS = {
  login: `${BASE_URL}login`,
  fileUpload: `${BASE_URL}upload_files_count`,
  chat_ai: `${BASE_URL}chat_ai`,
  execute_sql: `${BASE_URL}execute_sql`,
  get_ui_data: `${BASE_URL}get_ui_data`,
  processSessionData: `${BASE_URL}process_session_data`,
  get_dashboard_data: `${BASE_URL}get_dashboard_data`,
};