import { useEffect, useState } from "react";
import { useNotificationContext } from "../context/NotificationContext";
import NotificationItem from "./NotificationItem";
import { FaCheckCircle } from "react-icons/fa";
import FilterButton from "./FilterButton";

const Notifications = () => {
  const { allNotifications, fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } = useNotificationContext();
  const [filterType, setFilterType] = useState('all'); // 'all', 'reaction', 'comment', 'follow'

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleFilterChange = (type) => {
    setFilterType(type);
  };

  const filteredNotifications = allNotifications.filter(notification => {
    if (filterType === 'all') return true;
    return notification.type === filterType;
  });

  const unreadNotifications = filteredNotifications.filter(notification => !notification.read);
  const readNotifications = filteredNotifications.filter(notification => notification.read);

  return (
    <div className="max-w-lg mx-auto mt-4 bg-white shadow rounded-lg overflow-hidden">
  <div className="flex justify-between items-center border-b p-4 bg-gray-50">
    <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
    <button onClick={markAllNotificationsAsRead} className="text-blue-600 hover:text-blue-800 flex items-center">
      <FaCheckCircle className="mr-1" /> Marcar todas como leídas
    </button>
  </div>
  <div className="flex space-x-1 p-4 justify-center bg-gray-50">
    <FilterButton label="Todas" active={filterType === 'all'} onClick={() => handleFilterChange('all')} />
    <FilterButton label="Reacciones" active={filterType === 'reaction'} onClick={() => handleFilterChange('reaction')} />
    <FilterButton label="Comentarios" active={filterType === 'comment'} onClick={() => handleFilterChange('comment')} />
    <FilterButton label="Seguimientos" active={filterType === 'follow'} onClick={() => handleFilterChange('follow')} />
  </div>
      {unreadNotifications.length > 0 ? (
        <div>
          <h3 className="px-4 font-semibold">Nuevas</h3>
          {unreadNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMouseEnter={() => notification.type !== 'follow' && markNotificationAsRead(notification.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4">No tienes nuevas notificaciones.</div>
      )}
      {readNotifications.length > 0 && (
        <div>
          <h3 className="px-4 font-semibold">Notificaciones Leídas</h3>
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
