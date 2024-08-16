import axios from "axios";
import { getCookie, removeCookie } from "typescript-cookie";

const req = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
  },
});

// Add a request interceptor
req.interceptors.request.use(
  (config) => {
    const token = getCookie("__auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

req.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          // window.history.replaceState(null, "", "/servererror");
          break;
        case 503:
          window.history.replaceState(null, "", "/maintenance");
          break;
        case 401:
          removeCookie("__auth_token");
          localStorage.removeItem("__user_data");
          window.history.replaceState(null, "", "/"); // Redirect to home page
          break;
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default req;
