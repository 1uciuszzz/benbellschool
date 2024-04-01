import axios from "axios";
import { router } from "../router";

export const http = axios.create({
  baseURL: "/api",
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.navigate("/auth");
      return Promise.reject("No token");
    }
    config.headers.Authorization = token;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (value) => {
    return value;
  },
  (error) => {
    if (axios.isAxiosError(error)) {
      if (error.response?.status == 401) {
        localStorage.removeItem("token");
        router.navigate("/auth");
        return Promise.reject("Unauthorized");
      }
    }
    return Promise.reject(error);
  }
);
