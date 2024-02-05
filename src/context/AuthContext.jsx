/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axios from '../api/axios';
import { useNavigate } from "react-router-dom/";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState([]);

    const navigate = useNavigate();

    const csrf = () => axios.get("http://localhost:8000/sanctum/csrf-cookie");

    const getUser = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/user");
            setUser(data);
        } catch (error) {
            console.error("Error fetching user:", error.message);
        }
    };

    const login = async ({ ...data }) => {
        await csrf();
        setErrors([]);
        try {
            await axios.post('/api/login', data);
            await getUser();
            navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error during login:", error.message);
                setErrors({ general: ["An unexpected error occurred during login. Please try again."] });
            }
        }
    };

    const register = async ({ ...data }) => {
        await csrf();
        setErrors([]);
        try {
            await axios.post("/api/register", data);
            await getUser();
            navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error during registration:", error.message);
                setErrors({ general: ["An unexpected error occurred during registration. Please try again."] });
            }
        }
    };

    const forgotPassword = async (email) => {
        await csrf();
        setErrors([]);
        try {
            const response = await axios.post("/api/forgot-password", { email });
            return response.data;
        } catch (error) {
            if (error.response && (error.response.status === 422 || error.response.status === 429)) {
                setErrors(error.response.data.errors || { email: [error.response.data.message] });
            } else {
                console.error("Error during password reset request:", error.message);
                setErrors({ general: ["An unexpected error occurred. Please try again."] });
            }
            throw error;
        }
    };

    const resetPassword = async ({ email, token, password, password_confirmation }, onSuccess) => {
        await csrf();
        setErrors([]);
        try {
            const response = await axios.post("/api/reset-password", {
                token,
                email,
                password,
                password_confirmation,
            });
            setTimeout(() => {
                onSuccess(response.data);
            }, 2000);
        } catch (error) {
            if (error.response && (error.response.status === 422 || error.response.status === 429)) {
                setErrors(error.response.data.errors || { email: [error.response.data.message] });
            } else {
                console.error("Error during password reset:", error.message);
                setErrors({ general: ["An unexpected error occurred. Please try again."] });
            }
            throw error;
        }
    };
    const updateProfile = async (formData) => {
        await csrf();
        setErrors([]);
        try {
            const response = await axios.post(`/api/user/${user.data.id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const updatedUser = response.data;
          
            setUser(updatedUser); // Actualizar el usuario en el contexto
            navigate("/profile"); // Redirigir al perfil o donde sea apropiado
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error("Error during profile update:", error.message);
                setErrors({ general: ["An unexpected error occurred during profile update. Please try again."] });
            }
        }
    };

    const logout = async () => {
        try {
            await axios.post("/api/logout");
            setUser(null);
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user, errors, getUser, login, register, logout, forgotPassword, resetPassword, updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuthContext() {
    return useContext(AuthContext);
}
