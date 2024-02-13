import React, { useEffect, useState } from 'react';
import useAuthContext from '../context/AuthContext';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const { getNotifications } = useAuthContext();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const fetchedNotifications = await getNotifications();
                setNotifications(fetchedNotifications);
            } catch (error) {
                console.error("Error loading notifications:", error);
            }
        };

        fetchNotifications();
    }, [getNotifications]);

    return (
        <div className="notifications-container">
            {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                        {/* Personaliza cómo quieres mostrar cada notificación */}
                        {notification.message}
                    </div>
                ))
            ) : (
                <p>No tienes nuevas notificaciones.</p>
            )}
        </div>
    );
};

export default Notifications;
