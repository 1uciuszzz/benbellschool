import axios, { AxiosResponse } from "axios";
import { http } from "../utils/http";

interface SignInRequest {
  name: string;
}

interface SignInResponse {
  token: string;
}

interface UserInfoResponse {
  id: string;
  name: string;
}

export const AUTH_API = {
  USER_INFO: (): Promise<AxiosResponse<UserInfoResponse>> => http.get(`/auth`),
  SIGN_IN: (payload: SignInRequest): Promise<AxiosResponse<SignInResponse>> =>
    axios.post(`/api/auth/sign-in`, payload),
};
