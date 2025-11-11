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

export default instance;
