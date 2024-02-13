import { useEffect, useState } from 'react';
import useAuthContext from '../context/AuthContext';
import axios from 'axios'; // Asumiendo que ya tienes axios configurado

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
            await axios.patch(`/api/notifications/${notificationId}`, { read: true });
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
        <div className="notifications-container">
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} className="notification-item" onMouseEnter={() => handleMouseEnter(notification.id)} style={{ backgroundColor: notification.read ? '#fff' : '#ffcccc', cursor: 'pointer', padding: '10px', margin: '5px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                        <h4>{notification.type} - {notification.user_name}</h4> {/* Ajusta los campos según tu API */}
                        <p>{notification.message}</p>
                        <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: notification.read ? '#ccc' : '#ff0000', marginRight: '5px' }}></span>
                        {notification.read ? 'Leída' : 'Nueva'}
                    </div>
                ))
            ) : (
                <p>No tienes nuevas notificaciones.</p>
            )}
        </div>
    );
};

export default Notifications;
