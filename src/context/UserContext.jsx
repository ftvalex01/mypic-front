/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from 'react';
import { userService } from '../services/userServices';
import useAuthContext from "./AuthContext"; // Asegúrate de que la ruta sea correcta

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, setUser } = useAuthContext();
  const [errors, setErrors] = useState([]);

  const updateProfile = useCallback(async (formData) => {
    if (!user) return; // Añade esta comprobación para asegurar que user no es nulo
    try {
      const updatedUser = await userService.updateProfile(formData, user.data.id);
      setUser(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors(error.response?.data.errors || ["An unexpected error occurred. Please try again."]);
    }
  }, [user, setUser]);

  const updateProfilePrivacy = useCallback(async (isPrivate) => {
    if (!user) return; // Añade esta comprobación aquí también
    try {
      const updatedUser = await userService.updateProfilePrivacy(user.data.id, isPrivate);
      setUser((currentUser) => ({ ...currentUser, data: { ...currentUser.data, isPrivate: updatedUser.isPrivate } }));
    } catch (error) {
      console.error("Error updating profile privacy:", error);
      setErrors(error.response?.data.errors || ["An unexpected error occurred. Please try again."]);
    }
  }, [user, setUser]);

  const getUserImages = useCallback(async (userId) => {
    try {
      const images = await userService.getUserImages(userId);
      return images;
    } catch (error) {
      console.error("Error fetching user images:", error);
      setErrors(error.response?.data.errors || ["An unexpected error occurred. Please try again."]);
    }
  }, []);

  const value = {
    user,
    setUser,
    errors,
    setErrors,
    updateProfile,
    updateProfilePrivacy,
    getUserImages,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUserContext = () => useContext(UserContext);
