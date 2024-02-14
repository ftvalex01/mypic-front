import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthContext from '../context/AuthContext';
import axios from 'axios';
import { FaRegCommentDots, FaRegHeart, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { getNotifications } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await getNotifications();
                setNotifications(fetchedNotifications.data);
            } catch (error) {
                console.error("Error loading notifications:", error);
            }
        };

        fetchNotifications();
    }, [getNotifications]);

    const handleMouseEnter = async (notificationId) => {
        try {
            await axios.patch(`http://localhost:8000/api/notifications/${notificationId}`, { read: true });
            setNotifications(notifications.map(notification => {
                if (notification.id === notificationId) {
                    return { ...notification, read: true };
                }
                return notification;
            }));
        } catch (error) {
            console.error("Error updating notification:", error);
        }
    };

    const handleNotificationClick = (postId) => {
        navigate(`/post/${postId}`);
    };

    const markAllAsRead = async () => {
        // Implementar la lógica para marcar todas las notificaciones como leídas
        // Actualizar el estado después de la operación
    };

    return (
        <div className="notifications-container max-w-lg mx-auto mt-4 bg-white shadow rounded-lg">
          <div className="flex justify-between items-center border-b p-4">
            <h2 className="text-xl font-semibold text-gray-800">Notificaciones</h2>
            <button onClick={markAllAsRead} className="text-blue-600 hover:text-blue-800 flex items-center">
              <FaCheckCircle className="mr-1" /> Marcar todas como leídas
            </button>
          </div>
          <div className="p-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification.id}
                     onMouseEnter={() => handleMouseEnter(notification.id)}
                     onClick={() => handleNotificationClick(notification.related_post_id)}
                     className={`p-4 mb-2 flex items-start rounded-lg cursor-pointer hover:bg-gray-100 ${notification.read ? '' : 'bg-blue-50'}`}>
                  <div className="mr-3 text-lg">
                    {notification.type === "reaction" && <FaRegHeart className="text-red-500" />}
                    {notification.type === "comment" && <FaRegCommentDots className="text-blue-500" />}
                    {/* Añade más iconos según los tipos de notificación que tengas */}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800">{notification.user_name} {notification.action}</h4>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                  <div className="ml-auto pl-4">
                    <FaTimesCircle className={`text-lg ${notification.read ? 'text-gray-300' : 'text-red-500'} cursor-pointer`} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No tienes nuevas notificaciones.</p>
            )}
          </div>
        </div>
      );
};

export default Notifications;
