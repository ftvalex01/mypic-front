import Axios from "axios";

const axios =  Axios.create({
    baseURL:"http://localhost:8000",
    withCredentials:true,
    withXSRFToken: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    headers:{
        Accept: "application/json"
    }
});





export default axios;