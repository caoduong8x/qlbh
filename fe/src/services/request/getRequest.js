import webStorageClient from "config/webStorageClient";
import axiosInstance from "services/base/axiosInstance";
import { BASE_URL } from "services/constants";

const getRequest = (url, options) => {
  const params = options?.params;
  const tokenClient = webStorageClient.getToken();
  return axiosInstance
    .get(url, {
      params: params,
      headers: {
        Authorization: `Bearer ${tokenClient}`,
        "ngrok-skip-browser-warning": true,
        "superset-token": options?.tokenLoginSuperSet || undefined,
      },
    })
    .catch((error) => {
      if (
        error.response &&
        error.response.status === 401 &&
        !url.includes("/danh-sach-dashboard") &&
        !url.includes("superset")
      ) {
        webStorageClient.removeAll();
        window.location.href = `${BASE_URL}/login`;
      }
      return Promise.reject(error);
    });
};

export { getRequest };
