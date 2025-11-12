import HttpService from "./http.service";
import webStorageClient from "config/webStorageClient";

class AuthService {
  login = async (payload) => {
    const loginEndpoint = "/auth/login";
    const res = await HttpService.post(loginEndpoint, payload);
    return res;
  };

  register = async (credentials) => {
    const registerEndpoint = "register";
    return await HttpService.post(registerEndpoint, credentials);
  };

  logout = async () => {
    // const logoutEndpoint = "logout";
    // return await HttpService.post(logoutEndpoint);
    webStorageClient.removeAll();
  };

  forgotPassword = async (payload) => {
    const forgotPassword = "password-forgot";
    return await HttpService.post(forgotPassword, payload);
  };

  resetPassword = async (credentials) => {
    const resetPassword = "password-reset";
    return await HttpService.post(resetPassword, credentials);
  };

  getProfile = async () => {
    const getProfile = "me";
    return await HttpService.get(getProfile);
  };

  updateProfile = async (newInfo) => {
    const updateProfile = "me";
    return await HttpService.patch(updateProfile, newInfo);
  };
}

export default new AuthService();
