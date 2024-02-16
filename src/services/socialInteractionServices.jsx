// src/services/socialInteractionServices.js
import axios from '../api/axios';

const csrf = async () => {
  await axios.get('/sanctum/csrf-cookie');
};

export const socialInteractionService = {
  followUser: async (userId) => {
    await csrf();
    const response = await axios.post(`/api/user/${userId}/follow`);
    return response.data;
  },

  getFollowData: async (userId) => {
    await csrf();
    const response = await axios.get(`/api/user/${userId}/follow-data`);
    return response.data;
  },

  acceptFollowRequest: async (notificationId) => {
    await csrf();
    const response = await axios.post(`/api/notifications/${notificationId}/accept`);
    return response.data;
  },

  rejectFollowRequest: async (notificationId) => {
    await csrf();
    const response = await axios.post(`/api/notifications/${notificationId}/reject`);
    return response.data;
  },
};
