import axios from "axios";
import { POST_APIS } from "../../connection";
//import { LoginPayload, LoginResponse } from "../models/login.model";

class ApiServices {
   login(body) {
     return axios.post(POST_APIS.login, body);
   }
     chat(body) {
    return axios.post(POST_APIS.chat, body);
  }
  execute_sql(body) {
    return axios.post(POST_APIS.execute_sql, body);
  }
}

export default new ApiServices();
