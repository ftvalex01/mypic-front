import Axios from "axios";

const axios = Axios.create({
  baseURL: 'https://lucas.informaticamajada.es/',
  withXSRFToken: true,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    Accept: 'application/json',
  }
});
// Add a response interceptor
axios.interceptors.response.use((response) => {
  // If the request was successful, return the response
  return response;
}, (error) => {
  // If there's an error gin the response, handle it here
  throw error;
});

export default axios;