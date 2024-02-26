import Axios from 'axios';

// Crear una instancia de Axios con configuraciones predeterminadas
const axios = Axios.create({
  baseURL: 'https://lucas.informaticamajada.es/', // URL base de tu API
  withCredentials: true, // Importante para las cookies de sesión y CSRF
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Función auxiliar para obtener el valor de una cookie por su nombre
function getCookieValue(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

// Interceptor de solicitudes para añadir el token CSRF a las cabeceras
axios.interceptors.request.use((config) => {
  // Añadir el token CSRF a las cabeceras de la solicitud si está disponible
  const xsrfToken = getCookieValue('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
  }

  return config;
}, (error) => {
  // Manejo de errores en la solicitud
  return Promise.reject(error);
});

// Opcional: Interceptor de respuestas para manejar respuestas globales y errores
axios.interceptors.response.use((response) => {
  // Manejo exitoso de la respuesta
  return response;
}, (error) => {
  // Manejo de errores de respuesta
  // Aquí puedes añadir manejo de errores específicos, como renovación de token, redirecciones, etc.
  return Promise.reject(error);
});

export default axios;