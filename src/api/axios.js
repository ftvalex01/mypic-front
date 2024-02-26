import Axios from "axios";

const axios = Axios.create({
  baseURL: "https://lucas.informaticamajada.es/",
  withCredentials: true,
  headers: {
    Accept: "application/json",
  }
});

axios.interceptors.response.use(response => response, async (error) => {
  // Verifica si es un error de CSRF o de sesión y si no es una petición a '/api/user'
  if ((error.response && (error.response.status === 419 || error.response.status === 401)) && !error.config.url.endsWith('/api/user')) {
    // Verifica si ya se ha intentado reenviar la petición
    const retryCount = error.config.__retryCount || 0;
    if (retryCount < 2) { // Limita el número de reintentos a 2
      error.config.__retryCount = retryCount + 1; // Incrementa el contador de reintentos
      try {
        // Intenta obtener un nuevo token CSRF
        await axios.get('/sanctum/csrf-cookie');
        // Reintenta la petición original con el nuevo token CSRF
        return axios(error.config);
      } catch (csrfError) {
        // Si falla la obtención del token CSRF, rechaza la promesa
        return Promise.reject(csrfError);
      }
    }
  }
  // Para otros tipos de errores o si se alcanza el límite de reintentos, rechaza la promesa
  return Promise.reject(error);
});

export default axios;