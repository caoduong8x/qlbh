import axiosInstance from "services/base/axiosInstance";
import webStorageClient from "config/webStorageClient";
import { BASE_URL } from "services/constants";

const patchRequest = (url, options, formData) => {
  const data = options?.data;
  const tokenClient = webStorageClient.getToken();

  return axiosInstance
    .patch(url, data, {
      headers: {
        Authorization: `Bearer ${tokenClient}`,
        "ngrok-skip-browser-warning": true,
        "superset-token": options?.tokenLoginSuperSet || undefined,
        "Content-Type": formData ? formData : "application/json",
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

export { patchRequest };
