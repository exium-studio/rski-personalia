import axios from "axios";

const clientRequest = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
  },
});

clientRequest.interceptors.response.use(
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

// clientRequest.interceptors.response.use(null, (err) => {
//   const error = {
//     status: err.response?.status,
//     original: err,
//     validation: {},
//     message: null,
//   };

//   if(err.response?.status === 422){

//   }
// });

export default clientRequest;
