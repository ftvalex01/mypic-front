import Axios from "axios";

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // ¿Esta cookie comienza con el nombre que queremos?
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

const axios = Axios.create({
  baseURL: 'https://lucas.informaticamajada.es/',
  withCredentials: true, // Importante para que las cookies sean enviadas
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Aquí estableces el token CSRF
    Accept: 'application/json', // Corrige la falta de ortografía aquí también
  },
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