/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import{ createContext, useContext, useState, useEffect, useCallback } from 'react';
import { notificationService } from '../services/notificationServices';
import useAuthContext from './AuthContext'; // Verifica que esta ruta sea correcta

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [allNotifications, setAllNotifications] = useState([]);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const { user } = useAuthContext();

  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const response = await notificationService.getNotifications();
      const fetchedNotifications = response.data || [];


      // Filtrar las notificaciones para obtener solo las que pertenecen al usuario logeado
      const userNotifications = fetchedNotifications.filter(notification => notification.user_id === user.id);
  
      setAllNotifications(userNotifications);
      
      // Actualiza si hay notificaciones no leídas
      const unreadExists = userNotifications.some(notification => !notification.read);
      setHasUnreadNotifications(unreadExists);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [user]);
 
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]); // Dependencia fetchNotifications para ejecutar en montaje/componentDidMount

  const markNotificationAsRead = useCallback(async (notificationId) => {
    if (!user) return;
    try {
      await notificationService.markNotificationAsRead(notificationId);
      await fetchNotifications(); // Refresca las notificaciones después de actualizar
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, [fetchNotifications, user]); // Dependencias actualizadas
// Dentro de NotificationContext

const removeNotificationById = (notificationId) => {
  setAllNotifications(prevNotifications =>
    prevNotifications.filter(notification => notification.id !== notificationId)
  );
};

  const markAllNotificationsAsRead = useCallback(async () => {
    if (!user) return;
    try {
      await notificationService.markAllNotificationsAsRead();
      await fetchNotifications(); // Refresca las notificaciones después de actualizar
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  }, [fetchNotifications, user]); // Dependencias actualizadas

  return (
    <NotificationContext.Provider value={{
      allNotifications,
      hasUnreadNotifications,
      fetchNotifications,
      removeNotificationById,
      markNotificationAsRead,
      markAllNotificationsAsRead,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => useContext(NotificationContext);
