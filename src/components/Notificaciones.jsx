import { useEffect } from "react";
import { useNotificationContext } from "../context/NotificationContext";
import NotificationItem from "./NotificationItem"; // Asegúrate de que la ruta de importación sea correcta
import { FaCheckCircle } from "react-icons/fa";

const Notifications = () => {
  const {
    unreadNotifications,
    readNotifications,
    fetchNotifications,
    markAllNotificationsAsRead,
  } = useNotificationContext();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <div className="notifications-container max-w-lg mx-auto mt-4 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center border-b p-4">
        <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
        <button onClick={markAllNotificationsAsRead} className="text-blue-600 hover:text-blue-800 flex items-center">
          <FaCheckCircle className="mr-1" /> Marcar todas como leídas
        </button>
      </div>
      {/* Sección de notificaciones no leídas */}
      {unreadNotifications.length > 0 ? (
        <div>
          <h3 className="px-4 font-semibold">Nuevas</h3>
          {unreadNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4">No tienes nuevas notificaciones.</div>
      )}
      {/* Sección de notificaciones leídas */}
      {readNotifications.length > 0 && (
        <div>
          <h3 className="px-4 font-semibold">Notificaciones Leidas</h3>
          {readNotifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      )}
      {unreadNotifications.length === 0 && readNotifications.length === 0 && (
        <p className="text-center text-gray-500">No tienes nuevas notificaciones.</p>
      )}
    </div>
  );
};

export default Notifications;
