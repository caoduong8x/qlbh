import axiosInstance from "services/base/axiosInstance";
import webStorageClient from "config/webStorageClient";

const updateRequest = (url, options) => {
  const data = options?.data;
  const tokenClient = webStorageClient.getToken();

  return axiosInstance.put(url, data, {
    headers: {
      Authorization: `Bearer ${tokenClient}`,
    },
  });
};

export { updateRequest };
