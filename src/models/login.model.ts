import type { ApiResponse } from "./response.model";

export interface LoginPayload {
  user_email: string;
  password: string;
}

export interface LoginUserData {
  user_name: string;
  userId: string;
  username: string;
  email: string;
  token: string;
  roles?: string[];
}

export type LoginResponse = ApiResponse<LoginUserData>;
