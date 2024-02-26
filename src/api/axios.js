import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://laravel-react-api-latest.onrender.com/",
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    // Agrega aquí tus encabezados personalizados si es necesario
  }
});

axios.interceptors.response.use(response => response, async error => {
  // Verifica si es un error de CSRF, de sesión o un error 401 específicamente en la ruta de verificación de usuario
  if ((error.response && (error.response.status === 419 || error.response.status === 401)) && !error.config.url.endsWith('/api/user')) {
    // Intenta obtener un nuevo token CSRF solo si no estamos haciendo la petición de verificación de sesión
    try {
      await axios.get('/sanctum/csrf-cookie');
      // Reintenta la petición original
      return axios.request(error.config);
    } catch (csrfError) {
      return Promise.reject(csrfError);
    }
  }
  // Para otros tipos de errores o si estamos verificando la sesión, no reintentes la petición automáticamente
  return Promise.reject(error);
});


export default axios;