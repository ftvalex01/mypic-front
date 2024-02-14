import { useEffect, useState } from 'react';
import useAuthContext from '../context/AuthContext';
import axios from 'axios'; // Asumiendo que ya tienes axios configurado
import { FaRegCommentDots, FaRegHeart } from 'react-icons/fa';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { getNotifications } = useAuthContext();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await getNotifications();
                setNotifications(fetchedNotifications.data); // Asegúrate de acceder a la propiedad correcta
            } catch (error) {
                console.error("Error loading notifications:", error);
            }
        };

        fetchNotifications();
    }, [getNotifications]);

    const handleMouseEnter = async (notificationId) => {
        // Aquí podrías llamar a una API para marcar la notificación como leída
        try {
            await axios.patch("http://localhost:8000/api/notifications/" + notificationId, { read: true });
            // Actualizar el estado para reflejar el cambio sin recargar
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

    return (
        <div className="notifications-container max-w-md mx-auto mt-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div key={notification.id}
                   onMouseEnter={() => handleMouseEnter(notification.id)}
                   className={`p-4 m-2 flex items-center rounded-lg shadow-sm ${notification.read ? 'bg-white' : 'bg-red-100'} cursor-pointer`}>
                {/* Icono basado en el tipo de notificación */}
                <div className="mr-4">
                  {notification.type === "reaction" && <FaRegHeart className="text-red-500" />}
                  {notification.type === "comment" && <FaRegCommentDots className="text-blue-500" />}
                  {/* Añade más iconos según los tipos de notificación que tengas */}
                </div>
                <div>
                  <h4 className="font-bold">{notification.type} - {notification.user_name}</h4>
                  <p>{notification.message}</p>
                </div>
                <span className={`inline-block ml-auto ${notification.read ? 'bg-gray-400' : 'bg-red-500'} rounded-full h-2 w-2`}></span>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tienes nuevas notificaciones.</p>
          )}
        </div>
      );
      
};

export default Notifications;
