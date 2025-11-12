import Axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;
Axios.defaults.baseURL = API_URL;

export class HttpService {
  _axios = Axios.create();

  addRequestInterceptor = (onFulfilled, onRejected) => {
    this._axios.interceptors.request.use(onFulfilled, onRejected);
  };

  addResponseInterceptor = (onFulfilled, onRejected) => {
    this._axios.interceptors.response.use(onFulfilled, onRejected);
  };

  get = async (url, params = {}) =>
    await this.request(this.getOptionsConfig("get", url, null, params));

  post = async (url, data) =>
    await this.request(this.getOptionsConfig("post", url, data));

  put = async (url, data) =>
    await this.request(this.getOptionsConfig("put", url, data));

  patch = async (url, data) =>
    await this.request(this.getOptionsConfig("patch", url, data));

  delete = async (url) =>
    await this.request(this.getOptionsConfig("delete", url));

  getOptionsConfig = (method, url, data, params) => {
    return {
      method,
      url,
      data,
      params,
      headers: {
        "Content-Type": "application/vnd.api+json",
        "ngrok-skip-browser-warning": true,
      },
    };
  };

  request(options) {
    return new Promise((resolve, reject) => {
      console.log(resolve, reject);
      this._axios
        .request(options)
        .then((res) => resolve(res?.data))
        .catch((ex) => {
          reject(ex.response);
        });
    });
  }
}

export default new HttpService();
