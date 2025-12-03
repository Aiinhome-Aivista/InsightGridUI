const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const GET_APIS = {

};

export const POST_APIS = {
  login: `${BASE_URL}login`,
  fileUpload: `${BASE_URL}upload_files_count`,
  get_ui_data: `${BASE_URL}get_ui_data`,
};