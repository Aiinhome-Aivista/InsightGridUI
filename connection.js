const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GET_APIS = {

};

export const POST_APIS = {
  login: `${BASE_URL}login`,
  fileUpload: `${BASE_URL}upload_files_count`,
  chat: `${BASE_URL}chat`,
  execute_sql: `${BASE_URL}execute-sql`,
  
};