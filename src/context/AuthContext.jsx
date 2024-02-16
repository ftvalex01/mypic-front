/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/context/AuthContext.jsx

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authServices';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const initializeUser = async () => {
            try {
                const userData = await authService.getUser();
                
                setUser(userData);
            } catch (error) {
                console.error("Failed to fetch user:", error);
            }
        };
        initializeUser();
    }, []);
    

    const login = async (credentials) => {
        try {
            const userData = await authService.login(credentials);
            setUser(userData);
            navigate("/");
        } catch (error) {
            handleErrors(error);
        }
    };

    const register = async (credentials) => {
        try {
            const userData = await authService.register(credentials);
            setUser(userData);
            navigate("/");
        } catch (error) {
            handleErrors(error);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error);
        }
    };

    const forgotPassword = async (email) => {
        try {
            await authService.forgotPassword(email);
            // Handle post forgot password logic here
        } catch (error) {
            handleErrors(error);
        }
    };
    const fetchAllUsers = async () => {
        try {
          const response = await axios.get('api/users'); // Actualiza esta línea para usar la nueva ruta
    
          return response.data;
        } catch (error) {
          console.error("Error while fetching all users:", error.message);
          throw error;
        }
      };
    const fetchUserByUsername = async (username) => {
        try {
          const response = await axios.get(`api/user/${username}`); // Actualiza esta línea para usar la nueva ruta
    
          return response.data;
        } catch (error) {
          console.error("Error while fetching all users:", error.message);
          throw error;
        }
      };
    
    const resetPassword = async (data) => {
        try {
            await authService.resetPassword(data);
            // Handle post reset password logic here
        } catch (error) {
            handleErrors(error);
        }
    };

    const verifyEmail = async (email) => {
        try {
            const result = await authService.verifyEmail(email);
            return result; // result.available indicates if email is available
        } catch (error) {
            console.error("Error verifying email:", error);
            throw error;
        }
    };

    const handleErrors = (error) => {
        console.error("An error occurred:", error);
        setErrors(error.response?.data.errors || { general: ["An unexpected error occurred."] });
    };

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
            verifyEmail,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuthContext() {
    return useContext(AuthContext);
}
