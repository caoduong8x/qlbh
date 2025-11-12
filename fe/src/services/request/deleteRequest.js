import webStorageClient from "config/webStorageClient";
import axiosInstance from "services/base/axiosInstance";

const deleteRequest = (url, options) => {
  const data = options?.data;
  const tokenClient = webStorageClient.getToken();
  const tokenLoginSuperSet = options?.tokenLoginSuperSet;

  return axiosInstance
    .delete(url, {
      data,
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

const deleteRequestAll = (url, options) => {
  const data = options?.data;
  const tokenClient = webStorageClient.getToken();

  return axiosInstance.delete(url, {
    data,
    headers: {
      Authorization: `Bearer ${tokenClient}`,
      "Content-Type": "application/json",
    },
  });
};

export { deleteRequest, deleteRequestAll };
