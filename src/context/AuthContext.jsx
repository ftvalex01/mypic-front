/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);
    const [attemptedFetch, setAttemptedFetch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const login = useCallback(async (credentials) => {
        setIsLoading(true);
        try {
            const userData = await authService.login(credentials);
            setUser(userData); // Asegúrate de que tu backend está devolviendo un objeto con una propiedad 'user'
        } catch (error) {
            console.error("Login error:", error);
            setErrors(error.response?.data?.errors || ['Login failed']);
        } finally {
            setIsLoading(false);
            setAttemptedFetch(true);
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
        setIsLoading(true);
        try {
            await authService.logout();
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        } finally {
            setIsLoading(false);
            setAttemptedFetch(false);
        }
    }, [navigate]);

    const forgotPassword = useCallback(async (email) => {
        try {
            await authService.forgotPassword(email);
            // Handle post forgot password logic here
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
            console.log(response)
            return response.data; // La respuesta debe indicar si el nombre de usuario está disponible
        } catch (error) {
            console.error("Error checking username availability:", error.message);
            throw error; // Puedes optar por manejar el error de manera diferente si lo prefieres
        }
    }, []);

    const resetPassword = useCallback(async (data) => {
        try {
            await authService.resetPassword(data);
            // Handle post reset password logic here
        } catch (error) {
            handleErrors(error);
        }
    }, []);

    const verifyEmail = useCallback(async (email) => {
        try {
            const result = await authService.verifyEmail(email);
            return result;
        } catch (error) {
            console.error("Error verifying email:", error);
            throw error;
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
            fetchAllUsers,
            forgotPassword,
            resetPassword,
            fetchUserByUsername,
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
