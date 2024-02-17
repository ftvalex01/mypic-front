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
};
