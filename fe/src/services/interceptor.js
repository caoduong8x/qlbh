import webStorageClient from "config/webStorageClient";
import HttpService from "./http.service";
import { ACCESS_TOKEN } from "./constants";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "context";

export const setupAxiosInterceptors = (onUnauthenticated) => {
  const navigate = useNavigate();
  const onRequestSuccess = async (config) => {
    const token = webStorageClient.getToken(ACCESS_TOKEN);
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  };
  const onRequestFail = (error) => Promise.reject(error);

  HttpService.addRequestInterceptor(onRequestSuccess, onRequestFail);

  const onResponseSuccess = (response) => response;

  const onResponseFail = (error) => {
    // const status = error.status || error.response.status;
    // if (status === 403 || status === 401) {
    //   onUnauthenticated();
    //   AuthContext.logout();
    //   navigate("oauth/signin_callback");
    // }

    return Promise.reject(error);
  };
  HttpService.addResponseInterceptor(onResponseSuccess, onResponseFail);
};
