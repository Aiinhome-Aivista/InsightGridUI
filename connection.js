const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GET_APIS = {
  tracker: `${BASE_URL}tracker`,
};

export const POST_APIS = {
  login: `${BASE_URL}login`,
  fileUpload: `${BASE_URL}upload_files_count`,
  chat: `${BASE_URL}chat`,
  execute_sql: `${BASE_URL}execute-sql`,
  
  get_ui_data: `${BASE_URL}get_ui_data`,
  processSessionData: `${BASE_URL}process_session_data`,
};