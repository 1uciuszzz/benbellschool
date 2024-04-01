import axios, { AxiosResponse } from "axios";
import { http } from "../utils/http";

interface SignInRequest {
  username: string;
  password: string;
}

interface SignInResponse {
  token: string;
}

export const AUTH_API = {
  USER_INFO: (): Promise<AxiosResponse> => http.get(`/auth`),
  SIGN_IN: (payload: SignInRequest): Promise<AxiosResponse<SignInResponse>> =>
    axios.post(`/api/auth/sign-in`, payload),
};
