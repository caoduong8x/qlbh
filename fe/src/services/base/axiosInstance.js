import axios from "axios";
import { API_SERVER } from "services/constants";

const axiosInstance = axios.create({
  baseURL: API_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 600000,
});

axiosInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response?.status === 401 && !originalRequest._retry) {
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
