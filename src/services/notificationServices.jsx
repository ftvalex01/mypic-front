// src/services/notificationServices.js
import axios from '../api/axios';

const csrf = async () => {
  await axios.get('/sanctum/csrf-cookie');
};

export const notificationService = {
  getNotifications: async () => {
    await csrf();
    const response = await axios.get("/api/notifications");
    return response.data;
  },

  markNotificationAsRead: async (notificationId) => {
    await csrf();
    await axios.patch(`/api/notifications/${notificationId}`, { read: true });
    // Puedes decidir devolver algo específico aquí si es necesario
  },

  markAllNotificationsAsRead: async () => {
    await csrf();
    await axios.patch('/api/notifications/mark-all-read');
    // Puedes decidir devolver algo específico aquí si es necesario
  },
};
