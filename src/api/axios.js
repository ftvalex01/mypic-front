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
  withXSRFToken: true,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'), // Aquí estableces el token CSRF
    Accept: 'application/json', // Corrige la falta de ortografía aquí también
  },
});

axios.interceptors.response.use((response) => {
  // If the request was successful, return the response
  return response;
}, (error) => {
  // If there's an error gin the response, handle it here
  throw error;
});


export default axios;