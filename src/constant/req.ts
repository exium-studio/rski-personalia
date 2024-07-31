import axios from "axios";
import { Cookies } from "typescript-cookie";

const req = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    Authorization: `Bearer ${Cookies.get("__auth_token")}`,
  },
});

req.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 500:
          // window.location.href = "/servererror";
          break;
        case 503:
          window.location.href = "/maintenance";
          break;
        default:
          return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default req;
