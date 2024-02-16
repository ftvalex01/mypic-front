/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
// src/context/UserContext.jsx

import { createContext, useContext, useState} from 'react';
import { userService } from '../services/userServices';
import { useNavigate } from 'react-router-dom';
import useAuthContext from "../context/AuthContext";
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, setUser } = useAuthContext();
  const [errors, setErrors] = useState([]);


  const navigate = useNavigate();

  const updateProfile = async (formData) => {
    try {
      const updatedUser = await userService.updateProfile(formData, user.data.id);
      setUser(updatedUser);
      navigate("/profile");
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrors(error.response?.data.errors || {
        general: ["An unexpected error occurred. Please try again."],
      });
    }
  };

  const updateProfilePrivacy = async (isPrivate) => {
    try {
      const updatedUser = await userService.updateProfilePrivacy(user.data.id, isPrivate);
      setUser((currentUser) => ({ ...currentUser, data: { ...currentUser.data, isPrivate: updatedUser.isPrivate } }));
    } catch (error) {
      console.error("Error updating profile privacy:", error);
      setErrors(error.response?.data.errors || {
        general: ["An unexpected error occurred. Please try again."],
      });
    }
  };
  

  const getUserImages = async () => {
    try {
      const images = await userService.getUserImages(user.data.id);
     
      return images;
    } catch (error) {
      console.error("Error fetching user images:", error);
      setErrors(error.response?.data.errors || {
        general: ["An unexpected error occurred. Please try again."],
      });
    }
  };

  
  
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