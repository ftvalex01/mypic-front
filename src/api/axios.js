import Axios from "axios";

const axios = Axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  withXSRFToken: true,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  headers: {
    Accept: "application/json",
    // Agrega aquí tus encabezados personalizados si es necesario
  }
});

// Agregar un interceptor para manejar errores globalmente
axios.interceptors.response.use(
  (response) => {
    // Si la solicitud se realiza con éxito, devuelve la respuesta sin cambios
    return response;
  },
  (error) => {
    // Si hay un error en la solicitud, maneja el error aquí
    console.error("Error en la solicitud:", error);
    // Puedes lanzar un nuevo error personalizado aquí si es necesario
    return Promise.reject(error);
  }
);

export default axios;
