// src/services/socialInteractionServices.js
import axios from '../api/axios';


export const socialInteractionService = {
  followUser: async (userId) => {

    const response = await axios.post(`/api/user/${userId}/follow`);
    return response.data;
  },

  getFollowData: async (userId) => {

    const response = await axios.get(`/api/user/${userId}/follow-data`);
    return response.data;
  },

  acceptFollowRequest: async (notificationId) => {

    const response = await axios.post(`/api/notifications/${notificationId}/accept`);
    return response.data;
  },

  rejectFollowRequest: async (notificationId) => {

    const response = await axios.post(`/api/notifications/${notificationId}/reject`);
    return response.data;
  },

  blockUser: async (userId) => {
    const response = await axios.post(`/api/users/${userId}/block`);
    // Maneja la respuesta como prefieras
    return response.data;
  },

  unblockUser: async (userId) => {
    const response = await axios.delete(`/api/users/${userId}/unblock`);
    // Maneja la respuesta como prefieras
    return response.data;
  },
  checkIfBlocked: async (userId) => {
    const response = await axios.get(`/api/users/${userId}/is-blocked`);
    return response.data.isBlocked; // Asume que tu API devuelve { isBlocked: true/false }
  },
};
