import axios from "axios";
import { POST_APIS } from "../../connection";
//import { LoginPayload, LoginResponse } from "../models/login.model";

class ApiServices {
   login(body) {
     return axios.post(POST_APIS.login, body);
   }
   getUiData(body) {
    return axios.post(POST_APIS.get_ui_data, body);
  }
}

export default new ApiServices();
