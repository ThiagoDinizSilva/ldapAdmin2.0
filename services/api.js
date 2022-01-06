import axios from "axios";
import { GetToken } from "./auth";

const api = axios.create({
  baseURL: "http://api.dryad.tld:3001/"
});

api.interceptors.request.use(async config => {
  const token = GetToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;