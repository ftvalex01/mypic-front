import axios from '../api/axios';

// No es necesario llamar csrf en cada petición si usas interceptores.
export const authService = {
    getUser: async () => {
        const response = await axios.get("/api/user");
        return response.data;
    },

    login: async (data) => {
        
        const response = await axios.post("/api/login", data);

        return response.data; // Asume que el backend devuelve los detalles del usuario tras el login
    },

    register: async (data) => {
        const response = await axios.post("/api/register", data);
        return response.data; // Asume que el backend devuelve los detalles del usuario tras el registro
    },

    logout: async () => {
        await axios.post("/api/logout");
    },

    forgotPassword: async (email) => {
        const response = await axios.post("/api/forgot-password", { email });
        return response.data; // Asume que el backend devuelve alguna confirmación
    },

    resetPassword: async (data) => {
        const response = await axios.post("/api/reset-password", data);
        return response.data; // Asume que el backend devuelve alguna confirmación
    },

    verifyEmail: async (email) => {
        const response = await axios.get(`/api/verify-email/${email}`);
        return response.data; // Asume que el backend devuelve si el email está disponible o no
    },
};
