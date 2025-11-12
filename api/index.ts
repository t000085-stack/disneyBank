import axios, { InternalAxiosRequestConfig, AxiosError } from "axios";
import { getToken, deleteToken } from "./Storage";

const instance = axios.create({
  baseURL: "https://react-bank-project.eapi.joincoded.com",
});

instance.interceptors.request.use(
  async (request: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  }
);

// Response interceptor to handle errors WITHOUT deleting token
// Token will only be deleted on explicit logout
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 errors gracefully without deleting token
    // Token will only be deleted on explicit logout
    if (error.response?.status === 401) {
      // Don't delete token automatically - let user logout explicitly
      console.log(
        "Unauthorized - token may be expired, but keeping it until logout"
      );
    }
    return Promise.reject(error);
  }
);

export default instance;
