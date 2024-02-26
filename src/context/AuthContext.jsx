/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authServices';
import { useNavigate } from 'react-router-dom';

import axios from '../api/axios';
import Swal from 'sweetalert2';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const [errors, setErrors] = useState({});
    const [attemptedFetch, setAttemptedFetch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const login = useCallback(async (credentials) => {
        try {
            const response = await authService.login(credentials);

            if (!response.data.requires_2fa_verification) {
           
                setUser(response.data);
                navigate('/'); // Asegúrate de que esta línea se ejecuta
            }
  
            return response.data;
        } catch (error) {
            // Aquí manejas el error específico para correo electrónico no encontrado
            {
                // Para otros errores, podrías querer mostrar un mensaje genérico o basado en el error devuelto por el servidor
                setErrors({ general: [error.response.data.message || "Error al iniciar sesión."] });
            }
            setTimeout(() => {
                setErrors({});
            }, 2000); // Limpiar errores después de 2 segundos
            throw error;
        }
    }, [navigate]);
      
    
    const register = useCallback(async (credentials) => {
        setIsLoading(true);
        try {
            const userData = await authService.register(credentials);
            setUser(userData);
            navigate("/");
        } catch (error) {
            console.error("Registration error:", error);
            setErrors(error.response?.data?.errors || ['Registration failed']);
        } finally {
            setIsLoading(false);
            setAttemptedFetch(true);
        }
    }, [navigate]);

    const logout = useCallback(async () => {
        const despedida = `¡Gracias por visitarnos! Esperamos verte pronto.`;
        
        try {
            await authService.logout();
            await Swal.fire({
                title: `¡Hasta pronto, ${user.data.username}!`,
                text: despedida,
                icon: 'success',
                confirmButtonText: 'Adiós',
                timer: 2000, 
                didOpen: () => {
                    Swal.showLoading() 
                }
            });
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoading(false); // Asegúrate de que esta línea esté en tu código original
            setAttemptedFetch(false);
        }
    }, [navigate]);
    

    const forgotPassword = useCallback(async (email) => {
        try {
            const response = await authService.forgotPassword(email);
          
            return response;
        } catch (error) {
            handleErrors(error);
        }
    }, []);

    const fetchAllUsers = useCallback(async () => {
        try {
            const response = await axios.get('api/users');
            return response.data;
        } catch (error) {
            console.error("Error while fetching all users:", error.message);
            throw error;
        }
    }, []);

    const fetchUserByUsername = useCallback(async (username) => {
        try {
            const response = await axios.get(`api/user/${username}`);
            return response.data;
        } catch (error) {
            console.error("Error while fetching user by username:", error.message);
            throw error;
        }
    }, []);

    const checkUsernameAvailability = useCallback(async (username) => {
        try {
            const response = await axios.get(`api/check-username/${username}`);
            
            return response.data; // La respuesta debe indicar si el nombre de usuario está disponible
        } catch (error) {
            console.error("Error checking username availability:", error.message);
            throw error; // Puedes optar por manejar el error de manera diferente si lo prefieres
        }
    }, []);

    const resetPassword = useCallback(async (data) => {
        try {
           const response =  await authService.resetPassword(data);
            return response.data
        } catch (error) {
            handleErrors(error);
        }
    }, []);
    const verify2FA = useCallback(async (code, email) => {
        try {
          const response = await axios.post('/api/verify-2fa', { code, email });
        
          setUser(response.data); // Asume que la respuesta incluye los datos del usuario actualizados
          // Navegar al dashboard o a la página principal después de la verificación exitosa
          navigate("/");
        } catch (error) {
          console.error("Error verificando 2FA:", error.response?.data);
          // Mostrar mensajes de error de validación del backend
          setErrors(error.response?.data?.errors || ['La verificación 2FA falló.']);
        }
      }, [navigate]);
      

    const verifyEmail = useCallback(async (email) => {
        try {
            const result = await authService.verifyEmail(email);
            return result;
        } catch (error) {
            console.error("Error verifying email:", error);
            throw error;
        }
    }, []);
    const checkEmailUnique = useCallback(async (email) => {
        try {
            const result = await authService.checkEmailUnique(email);
            return result; // Retorna el resultado para manejarlo en el componente
        } catch (error) {
            handleErrors(error); // Usa la función existente para manejar errores si ya tienes una
            throw error; // Lanza el error para permitir al componente manejar mensajes específicos
        }
    }, []);
    const handleErrors = useCallback((error) => {
        console.error("An error occurred:", error);
        setErrors(error.response?.data.errors || { general: ["An unexpected error occurred."] });
    }, []);

    useEffect(() => {
        
        if (!attemptedFetch) {
            setIsLoading(true);
            const initializeUser = async () => {
                try {
                    const userData = await authService.getUser();
                    setUser(userData);
                    navigate('/')
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                } finally {
                    setIsLoading(false);
                    setAttemptedFetch(true);
                }
            };
            initializeUser();
        }
    }, [attemptedFetch]);

    return (
        <AuthContext.Provider value={{
            user,
            errors,
            setUser,
            setErrors,
            login,
            register,
            logout,
            verify2FA,
            fetchAllUsers,
            forgotPassword,
            resetPassword,
            fetchUserByUsername,
            checkEmailUnique,
            checkUsernameAvailability,
            verifyEmail,
            isLoading
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuthContext() {
    return useContext(AuthContext);
}
