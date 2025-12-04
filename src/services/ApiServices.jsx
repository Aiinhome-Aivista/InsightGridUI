import axios from "axios";
import { GET_APIS, POST_APIS } from "../../connection";
//import { LoginPayload, LoginResponse } from "../models/login.model";

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


  fileUpload(formData) {
    return axios.post(POST_APIS.fileUpload, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  processSessionData(body) {
    return axios.post(POST_APIS.processSessionData, body);
  }

  tracker() {
    return axios.get(GET_APIS.tracker);
  }
}

export default new ApiServices();
