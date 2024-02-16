/* eslint-disable react/prop-types */
import { createContext, useContext, useState, useEffect } from 'react';
import { notificationService } from '../services/notificationServices';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const response = await notificationService.getNotifications();
    if (response.data) {
      setAllNotifications(response.data);
      // Filtra y establece notificaciones no leídas y leídas
      const unread = response.data.filter(notification => !notification.read);
      const read = response.data.filter(notification => notification.read);
      setUnreadNotifications(unread);
      setReadNotifications(read);
    } else {
      console.error('Unexpected response structure:', response);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    await notificationService.markNotificationAsRead(notificationId);
    // Actualiza las notificaciones después de marcar una como leída
    await fetchNotifications();
  };

  const markAllNotificationsAsRead = async () => {
    await notificationService.markAllNotificationsAsRead();
    // Recarga las notificaciones después de marcar todas como leídas
    await fetchNotifications();
  };

  return (
    <NotificationContext.Provider value={{
      allNotifications,
      unreadNotifications,
      readNotifications,
      fetchNotifications,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
