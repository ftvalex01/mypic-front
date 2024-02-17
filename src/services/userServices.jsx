// src/services/userService.js

import axios from '../api/axios';

export const userService = {
  updateProfile: async (formData, userId) => {
   
    const response = await axios.post(`/api/user/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  updateProfilePrivacy: async (userId, isPrivate) => {

    const response = await axios.patch(`/api/user/${userId}/privacy`, { isPrivate });
    return response.data;
  },

  getUserImages: async (userId) => {
   
    const response = await axios.get(`/api/user/${userId}/images`);
    return response.data;
  },
  
  fetchAllUsers: async () => {
  
    try {
      const response = await axios.get('api/users'); // Actualiza esta línea para usar la nueva ruta
  
      return response.data;
    } catch (error) {
      console.error("Error while fetching all users:", error.message);
      throw error;
    }
  
  },

 fetchUserByUsername: async (username) => {

    try {
      const response = await axios.get(`api/user/${username}`); // Actualiza esta línea para usar la nueva ruta
  
      return response.data;
    } catch (error) {
      console.error("Error while fetching all users:", error.message);
      throw error;
    }
  },  

};

