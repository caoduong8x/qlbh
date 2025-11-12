import axios from "axios";
import { SSO, SERVER_TYPE, API_SERVER } from "services/constants";

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
      // window.location.replace(`${SSO}/oauth/signin?type=${SERVER_TYPE}`);
      // const dispatch = useDispatch<AppDispatch>();
      // dispatch(actionLogin);
      // originalRequest._retry = true;
      // dispatch(actionLogin({ isAuth: false }));
      // // Refresh the token
      // return axiosInstance.post('/refresh-token').then(({ data }) => {
      //   // Update the token in the headers
      //   axiosInstance.defaults.headers.common[
      //     'Authorization'
      //   ] = `Bearer ${data.token}`;
      //   originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
      //   // Repeat the original request with the updated headers
      //   return axiosInstance(originalRequest);
      // });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
