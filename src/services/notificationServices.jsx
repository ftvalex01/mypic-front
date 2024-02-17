// src/services/notificationServices.js
import axios from '../api/axios';


export const notificationService = {
  getNotifications: async () => {
   
    const response = await axios.get("/api/notifications");
    return response.data;
  },

  markNotificationAsRead: async (notificationId) => {

    await axios.patch(`/api/notifications/${notificationId}`, { read: true });
    // Puedes decidir devolver algo específico aquí si es necesario
  },

  markAllNotificationsAsRead: async () => {

    await axios.patch('/api/notifications/mark-all-read');
    // Puedes decidir devolver algo específico aquí si es necesario
  },
};
